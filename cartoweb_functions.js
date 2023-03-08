// Créez un tableau de couleurs que vous souhaitez utiliser pour vos marqueurs
var liste_couleur_marqueur = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

// Générez un index de couleur aléatoire en utilisant la longueur de votre tableau de couleurs
var randomColor = Math.floor(Math.random() * liste_couleur_marqueur.length);

function createHexGrid(bounds, hexSize) {
  const hexWidth = hexSize * Math.sqrt(3);
  const hexHeight = hexSize * 2;
  const rows = Math.ceil((bounds.getNorth() - bounds.getSouth()) / (hexHeight * 0.75));
  const evenRowCols = Math.ceil((bounds.getEast() - bounds.getWest()) / hexWidth);
  const oddRowCols = Math.ceil(((bounds.getEast() - bounds.getWest()) - (hexWidth / 2)) / hexWidth);
  const numCols = Math.max(evenRowCols, oddRowCols);
  
  const grid = [];
  
  for (let i = 0; i < rows; i++) {
      const y = bounds.getSouth() + i * hexHeight * 0.75;
      const cols = i % 2 === 0 ? evenRowCols : oddRowCols;
      for (let j = 0; j < cols; j++) {
      const x = bounds.getWest() + j * hexWidth + (i % 2 === 1 ? hexWidth / 2 : 0);
      const hex = L.polygon(getHexVertices(hexSize), {
          color : 'gray',
          fillOpacity: 0.3
      }).addTo(map);
      hex.setLatLngs([
          [y + hexSize, x],
          [y + hexSize / 2, x + hexWidth / 2],
          [y - hexSize / 2, x + hexWidth / 2],
          [y - hexSize, x],
          [y - hexSize / 2, x - hexWidth / 2],
          [y + hexSize / 2, x - hexWidth / 2]
      ]);
      grid.push(hex);
      }
  }
  
  return grid;
}

function createSquareGrid(bounds, squareGrid) {

  // Créer un tableau vide pour stocker les carrés de la grille
  var squares = [];

  // Calculer le nombre de carrés en largeur et en hauteur
  var numCols = Math.ceil((bounds.getEast() - bounds.getWest()) / squareGrid);
  var numRows = Math.ceil((bounds.getNorth() - bounds.getSouth()) / squareGrid);

  // Boucler à travers chaque ligne et colonne pour créer les carrés
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      // Calcul les coords du coin supérieur gauche de chaque carrés
      var squareBounds = L.latLngBounds(
        [bounds.getSouth() + i * squareGrid, bounds.getWest() + j * squareGrid],
        [bounds.getSouth() + (i + 1) * squareGrid, bounds.getWest() + (j + 1) * squareGrid]
      );

      // Ajouter le carré à la carte et au tableau de carrés
      var square = L.rectangle(squareBounds, { color: 'gray', weight: 1, fillOpacity : 0.3 }).addTo(map);
      squares.push(square);
    }
  }

  // Retourner le tableau de carrés
  return squares;
}


function getHexVertices(size) {
const vertices = [];
for (let i = 0; i < 6; i++) {
  const angle = 2 * Math.PI / 6 * i;
  const x = size * Math.cos(angle);
  const y = size * Math.sin(angle);
  vertices.push([y, x]);
}
return vertices;
}

//MAJ la position de l'animated marker sur le volet stat
function updatePositionDisplay(voiture) {
  // Récupérer les coordonnées de l'animated marker
  var coords = voiture.getLatLng();
  // Mettre à jour le contenu de l'élément <p>
  document.getElementById("position-display").innerHTML = "Latitude : " + coords.lat + ", Longitude : " + coords.lng;
}

function generateRandomPoint(latitude, longitude) {
  // Générez un rayon aléatoire en degrés (0 à 360)
  var radius = Math.random() * 360;

  // Convertissez le rayon en radians
  var radians = radius * Math.PI / 180;

  // Calculez la distance en degrés en utilisant la formule de Haversine
  var distance = RAYON_ZONE_DEPLACEMENT / 111.12;

  // Calculez la nouvelle latitude en utilisant la formule de Haversine
  var newLatitude = latitude + (distance * Math.cos(radians));

  // Calculez la nouvelle longitude en utilisant la formule de Haversine
  var newLongitude = longitude + (distance * Math.sin(radians) / Math.cos(latitude * Math.PI / 180));

  // Retournez le nouveau point sous forme de LatLng Leaflet
  return L.latLng(newLatitude, newLongitude);
}

function isMarkerInsidePolygon(x, y, poly) {
    
    let polyPoints = poly.getLatLngs();       

    let inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        let xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        let xj = polyPoints[j].lat, yj = polyPoints[j].lng;

        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi); //A REVOIR
        if (intersect) inside = !inside;
    }
    console.log(inside);
    return inside;
}

//MAJ la position de l'animated marker sur le volet stat && MAJ couleur polygones
function updatePositionDisplay(voiture) {
    var coords = voiture.getLatLng();
    document.getElementById("position-display").innerHTML = "Latitude : " + coords.lat + ", Longitude : " + coords.lng;
}

function updateHexagonColor(voiture) {
    for (let i = 0; i < squareGrid.length; i++) {
        const hex = squareGrid[i].getBounds();
        if (hex.contains(voiture.getLatLng())) { //if(isMarkerInsidePolygon(voiture1.getLatLng().lat,voiture1.getLatLng().lng, squareGrid[i])) {
            squareGrid[i].setStyle({fillColor: 'green'});
            document.getElementById("hexagon-display").innerHTML = "Index de l'hexagone : " + i;
        } else {
            squareGrid[i].setStyle({fillColor: 'gray'});
        }
    }
}