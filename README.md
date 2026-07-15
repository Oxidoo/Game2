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
- **Relief** : plateaux surélevés avec falaises, escaliers pour y grimper,
  passerelles en bois pour franchir rivières et lacs — le pathfinding et
  les combats en tiennent compte.
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
| Se déplacer / attaquer un groupe / parler au marchand | clic gauche |
| Choisir un sort | clic sur la barre de sorts ou touches `1`–`5` |
| Annuler le sort visé | clic droit ou `Échap` |
| Fin de tour | bouton ou `Espace` |
| Menu (quitter, changer de personnage, son) | `Échap` |
| Inventaire / carte du monde | `I` / `M` |
| Fiche personnage / aide | `C` / `H` |

## Technique

HTML + CSS + JavaScript vanilla dans un unique `index.html` (~2 900 lignes).
Rendu isométrique en Canvas 2D avec élévation (tri en profondeur tuiles/entités,
falaises, escaliers, passerelles), sprites et icônes de sorts dessinés
procéduralement, musique et effets synthétisés en WebAudio (séquenceur à deux
thèmes), pathfinding A* et BFS sensibles au relief, ligne de vue par
échantillonnage. Aucune ressource externe, aucune requête réseau.
