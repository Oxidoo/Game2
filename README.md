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
  Élémentaliste (magie de zone et soin) — 5 sorts par classe, débloqués aux
  niveaux 1, 3, 6 et 9 (les sorts verrouillés sont visibles dans la barre avec un cadenas).
- **Combat tactique** : 6 PA / 3 PM par tour, portées min/max, tirs en ligne,
  ligne de vue, zones d'effet en croix, poussée avec dégâts de collision,
  poison, entrave de PM, buff de dégâts, phase de placement, ordre d'initiative.
- **Relief vertical** : chaque carte flotte au-dessus d'un abîme de brume
  verte luminescente — les bords du monde plongent dans le vide, des gouffres
  percent le sol et les grands plateaux, des cascades tombent des falaises,
  des lucioles montent des profondeurs. Terrasses sur plusieurs étages
  (sommets en dalles de pierre moussues, lierre sur les parois, colonnes en
  ruine), escaliers, échelles plaquées aux falaises, passerelles, ponts
  suspendus (parfois au-dessus du vide) et plateformes élévatrices — le
  pathfinding, l'IA et les combats en tiennent compte (impossible de pousser
  un ennemi à travers une falaise… mais on peut l'écraser contre).
- **Animations de combat** : charge au corps à corps, rebond d'incantation,
  flash et onde de choc à l'impact, secousse d'écran.
- **Chat** : touche Entrée, le message s'affiche en bulle au-dessus du
  personnage pendant 3,5 s (les PNJ et le marchand proches répondent) —
  l'interface est prête pour un vrai multijoueur, qui nécessiterait un serveur.
- **PNJ et quêtes** : quatre personnages (berger, garde, herboriste,
  ancienne) donnent des quêtes de collecte et de chasse — marqueurs « ! » /
  « ? », suivi à l'écran, récompenses en écus, expérience et objets.
- **Musique dynamique** : thème d'exploration calme, thème de combat nerveux
  (synthétisés en WebAudio, réglables dans le menu).
- **9 zones** reliées entre elles, du village paisible à l'Antre du Roi Bouloufe (boss),
  avec une **carte du monde** qui révèle les zones au fur et à mesure de l'exploration.
- **Inventaire et marché** : potions utilisables en combat (2 PA), armes, armures,
  amulette (+1 PA) et anneau (+1 PM) ; les monstres laissent du butin à revendre
  au marchand du village.
- **5 types de monstres** avec IA (approche, attaque à distance, attaques multiples).
- **Progression** : expérience, niveaux, écus, fontaine de soin au village,
  une **sauvegarde automatique par classe** (localStorage) — on change de
  personnage depuis le menu sans rien perdre.

## Commandes

| Action | Commande |
|---|---|
| Se déplacer / attaquer / parler aux PNJ et au marchand | clic gauche |
| Chat (bulle au-dessus du personnage) | `Entrée` |
| Choisir un sort | clic sur la barre de sorts ou touches `1`–`5` |
| Annuler le sort visé | clic droit ou `Échap` |
| Fin de tour | bouton ou `Espace` |
| Menu (quitter, changer de personnage, son) | `Échap` |
| Inventaire / carte du monde | `I` / `M` |
| Fiche personnage / aide | `C` / `H` |

## Technique

HTML + CSS + JavaScript vanilla dans un unique `index.html` (~3 400 lignes).
Rendu isométrique en Canvas 2D avec élévation multi-niveaux (tri en profondeur
tuiles/entités, falaises, escaliers, ponts suspendus, plateformes animées),
sprites, PNJ et icônes de sorts dessinés procéduralement, musique et effets
synthétisés en WebAudio (séquenceur à deux thèmes), pathfinding A* et BFS
sensibles au relief, ligne de vue par échantillonnage, quêtes pilotées par les
données. Aucune ressource externe, aucune requête réseau.
