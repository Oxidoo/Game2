#!/usr/bin/env node
/* =====================================================================
   LES TERRES D'ÉBRUME — serveur multijoueur (un seul fichier)
   Sert le jeu (index.html) et synchronise les joueurs par WebSocket :
   présence, chat, combats coopératifs, duels, échanges.
   Usage : npm install && node server.js   →  http://localhost:3000
   ===================================================================== */
'use strict';
const http=require('http');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const {WebSocketServer}=require('ws');

const PORT=process.env.PORT||3000;
const ROOT=__dirname;

// ---------- HTTP : sert index.html (et rien d'autre de sensible) ----------
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  const url=(req.url||'/').split('?')[0];
  if(url==='/favicon.ico'){res.writeHead(204);res.end();return;}
  let file=url==='/'?'/index.html':url;
  file=path.normalize(file).replace(/^(\.\.[/\\])+/,'');
  const full=path.join(ROOT,file);
  if(!full.startsWith(ROOT)||file.includes('server.js')||file.includes('node_modules')){
    res.writeHead(403);res.end('Non.');return;
  }
  fs.readFile(full,(err,data)=>{
    if(err){res.writeHead(404);res.end('Introuvable');return;}
    res.writeHead(200,{'Content-Type':MIME[path.extname(full)]||'application/octet-stream'});
    res.end(data);
  });
});

// ---------- Salles ----------
// room = { players: Map<id,{ws,info}>, fights: Map<fid,{host,map,x,y,phase}> }
const rooms=new Map();
function getRoom(name){
  if(!rooms.has(name))rooms.set(name,{players:new Map(),fights:new Map()});
  return rooms.get(name);
}
function send(ws,msg){
  if(ws.readyState===1)ws.send(JSON.stringify(msg));
}
function broadcast(room,msg,exceptId){
  for(const[id,p]of room.players){
    if(id!==exceptId)send(p.ws,msg);
  }
}

// ---------- WebSocket ----------
const wss=new WebSocketServer({server,path:'/ws'});
wss.on('connection',(ws,req)=>{
  const id=crypto.randomBytes(4).toString('hex');
  let room=null,roomName=null;
  ws.isAlive=true;
  ws.on('pong',()=>{ws.isAlive=true;});
  ws.on('message',raw=>{
    let m;
    try{m=JSON.parse(raw);}catch(e){return;}
    if(m.t==='join'){
      roomName=String(m.room||'ebrume').slice(0,24).replace(/[^a-zA-Z0-9_-]/g,'')||'ebrume';
      room=getRoom(roomName);
      const info={id,name:String(m.name||'Aventurier').slice(0,20),cls:m.cls,lvl:m.lvl|0,
                  map:m.map,x:m.x|0,y:m.y|0};
      room.players.set(id,{ws,info});
      send(ws,{t:'welcome',id,players:[...room.players.values()].filter(p=>p.info.id!==id).map(p=>p.info),
               fights:[...room.fights.values()]});
      broadcast(room,{t:'p.join',p:info},id);
      console.log(`[${roomName}] ${info.name} (${id}) rejoint — ${room.players.size} joueur(s)`);
      return;
    }
    if(!room)return;
    const me=room.players.get(id);
    if(!me)return;
    switch(m.t){
      case 'pos':
        Object.assign(me.info,{map:m.map,x:m.x|0,y:m.y|0});
        broadcast(room,{t:'p.pos',id,map:m.map,x:m.x,y:m.y,pz:m.pz},id);
        break;
      case 'profile':
        if(m.name)me.info.name=String(m.name).slice(0,20);
        if(m.lvl)me.info.lvl=m.lvl|0;
        broadcast(room,{t:'p.profile',id,name:me.info.name,lvl:me.info.lvl},id);
        break;
      case 'chat':
        broadcast(room,{t:'p.chat',id,text:String(m.text||'').slice(0,120)},id);
        break;
      // ----- combats en réseau : l'hôte fait autorité, le serveur relaie -----
      case 'fight.start':
        room.fights.set(m.fid,{fid:m.fid,host:id,map:m.map,x:m.x,y:m.y,phase:'place',duel:!!m.duel});
        broadcast(room,{t:'fight.start',fid:m.fid,host:id,map:m.map,x:m.x,y:m.y,duel:!!m.duel},id);
        break;
      case 'fight.phase':{
        const f=room.fights.get(m.fid);
        if(f&&f.host===id){f.phase=m.phase;broadcast(room,{t:'fight.phase',fid:m.fid,phase:m.phase},id);}
        break;
      }
      case 'fight.join':{ // un joueur veut rejoindre → transmis à l'hôte
        const f=room.fights.get(m.fid);
        if(f){
          const host=room.players.get(f.host);
          if(host)send(host.ws,{t:'fight.join',fid:m.fid,from:id,p:m.p});
        }
        break;
      }
      case 'fight.ev':{ // événements de l'hôte → participants listés
        for(const pid of m.to||[]){
          const p=room.players.get(pid);
          if(p)send(p.ws,{t:'fight.ev',fid:m.fid,ev:m.ev});
        }
        break;
      }
      case 'fight.action':{ // action d'un participant → hôte
        const f=room.fights.get(m.fid);
        if(f){
          const host=room.players.get(f.host);
          if(host)send(host.ws,{t:'fight.action',fid:m.fid,from:id,a:m.a});
        }
        break;
      }
      case 'fight.end':{
        const f=room.fights.get(m.fid);
        if(f&&f.host===id){room.fights.delete(m.fid);broadcast(room,{t:'fight.end',fid:m.fid},id);}
        break;
      }
      // ----- duels & échanges : simple relais vers un joueur précis -----
      case 'duel.req':case 'duel.acc':case 'duel.dec':
      case 'trade.req':case 'trade.acc':case 'trade.dec':
      case 'trade.offer':case 'trade.confirm':case 'trade.cancel':{
        const target=room.players.get(m.to);
        if(target)send(target.ws,Object.assign({},m,{from:id,fromName:me.info.name}));
        break;
      }
    }
  });
  ws.on('close',()=>{
    if(!room)return;
    const me=room.players.get(id);
    room.players.delete(id);
    // les combats hébergés par ce joueur sont annulés
    for(const[fid,f]of room.fights){
      if(f.host===id)room.fights.delete(fid);
    }
    broadcast(room,{t:'p.leave',id});
    if(me)console.log(`[${roomName}] ${me.info.name} (${id}) parti — ${room.players.size} joueur(s)`);
    if(room.players.size===0)rooms.delete(roomName);
  });
});

// ping de survie : coupe les connexions mortes
setInterval(()=>{
  for(const ws of wss.clients){
    if(!ws.isAlive){ws.terminate();continue;}
    ws.isAlive=false;
    ws.ping();
  }
},30000);

server.listen(PORT,()=>{
  console.log(`Les Terres d'Ébrume — serveur prêt sur http://localhost:${PORT}`);
  console.log(`Partagez : http://<votre-ip>:${PORT}/?room=<code>`);
});
