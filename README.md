# Les Terres d'Ébrume — Chroniques tactiques

Un RPG tactique au tour par tour jouable directement dans le navigateur, inspiré des
mécaniques de DOFUS (grille isométrique, points d'action et de mouvement, ligne de vue,
sorts à zone d'effet). Univers, noms, graphismes et code entièrement originaux.

**Aucune installation, aucune dépendance : un seul fichier.** Ouvrez `index.html`
dans n'importe quel navigateur moderne, c'est tout.

## Jouer

```
# option 1 : double-cliquez sur index.html
# option 2 : servez le dossier
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Le jeu

- **3 classes** : Bretteur (corps à corps), Franc-Tireur (distance, poussée, poison),
  Élémentaliste (magie de zone et soin) — 5 sorts par classe, débloqués en montant de niveau.
- **Combat tactique** : 6 PA / 3 PM par tour, portées min/max, tirs en ligne,
  ligne de vue, zones d'effet en croix, poussée avec dégâts de collision,
  poison, entrave de PM, buff de dégâts, phase de placement, ordre d'initiative.
- **9 zones** reliées entre elles, du village paisible à l'Antre du Roi Bouloufe (boss).
- **5 types de monstres** avec IA (approche, attaque à distance, attaques multiples).
- **Progression** : expérience, niveaux, écus, fontaine de soin au village,
  sauvegarde automatique dans le navigateur (localStorage).

## Commandes

| Action | Commande |
|---|---|
| Se déplacer / attaquer un groupe | clic gauche |
| Choisir un sort | clic sur la barre de sorts ou touches `1`–`5` |
| Annuler le sort visé | clic droit ou `Échap` |
| Fin de tour | bouton ou `Espace` |
| Fiche personnage / aide / son | `C` / `H` / `M` |

## Technique

HTML + CSS + JavaScript vanilla dans un unique `index.html` (~2 000 lignes).
Rendu isométrique en Canvas 2D (tuiles, sprites et icônes de sorts dessinés
procéduralement), effets sonores synthétisés en WebAudio, pathfinding A* et BFS,
ligne de vue par échantillonnage. Aucune ressource externe, aucune requête réseau.
