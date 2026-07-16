#!/bin/bash
# Les Terres d'Ébrume — lanceur Mac/Linux : double-cliquez, c'est tout.
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js n'est pas installé sur cet ordinateur."
  echo "  1. Va sur  https://nodejs.org"
  echo "  2. Clique le gros bouton vert et installe"
  echo "  3. Relance ce fichier"
  echo ""
  read -r -p "Appuie sur Entrée pour fermer."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Première installation, patiente quelques secondes..."
  npm install
fi

echo ""
echo "  Le jeu va s'ouvrir dans ton navigateur."
echo "  NE FERME PAS cette fenêtre : c'est elle le serveur !"
echo ""
( sleep 2 && (open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null) ) &
node server.js
