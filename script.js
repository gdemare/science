$(document).ready(function() {
//##############################################
//----------------------------------------------
// hierachie
hierarchie = [
  ['domaines', 'DOM', '', 1],
  ['concepts', 'CON', 'DOM', 0],
  ['idee', 'IDE', 'CON', 0],
  ['Stades géologiques et de la vie de la Terre', 'GEO', 'CON', 0]
];
//----------------------------------------------
// importer les fichiers
var url = 'https://raw.githubusercontent.com/gdemare/science/master/data/data.json';



//----------------------------------------------
// recherche dans la table
var categorie;
function dataContenu(id) {
  categorie = id.slice(0,3);
  return data[categorie][id];
};

//----------------------------------------------
// liens
var ascdesc;
function fctLiens() {
  ascdesc = [];
  for (var i = liens.length - 1; i >= 0; i--) {
    for (var j = liens[1].length - 1; j >= 0; j--) {
      if (liens[i][j] == select) {
        for (var k = liens[1].length - 1; k >= 0; k--) {
          ascdesc[ascdesc.length] = liens[i][k];
        }
      };
    };
  };
  ascdesc = ascdesc.filter(different);
}

function different(element) {
  return element != select;
}

//----------------------------------------------
//ascendant/descendant
var hierarAsce, 
    hierarDesce;
function fctHierarchie() {
  hierarAsce = [];
  hierarDesce = [];
  for (var i = hierarchie.length - 1; i >= 0; i--) {
    if (hierarchie[i][1] == categorie) {
      hierarAsce.push(hierarchie[i][2]);
    };
    if (hierarchie[i][2].indexOf(categorie)>-1) {
      hierarDesce.push(hierarchie[i][1]);
    };
  }
}

//----------------------------------------------
// separer les id en hierarchie ascendante/descendante
var ascendant,
    descendant;
function fctAsceDesce() {
  ascendant = "";
  descendant = "";
  for (var i = ascdesc.length - 1; i >= 0; i--) {
    idliens = ascdesc[i].substring(0,3);
    if (hierarAsce.indexOf(idliens)>-1) {
      ascendant = ascendant + "<div id='" + ascdesc[i] + "' >" + dataContenu(ascdesc[i]).contenu + "</div>";
    }
    else  if (hierarDesce.indexOf(idliens)>-1) {
      descendant = ascendant + "<div id='" + ascdesc[i] + "' >" + dataContenu(ascdesc[i]).contenu + "</div>";
    }
  }
  //document.getElementById('ascendant').innerHTML = ascendant;
  console.log(ascendant);
  //document.getElementById('descendant').innerHTML = descendant;
  console.log(descendant);
}

/* bouton lorsque l'on clique sur une idée
for (var i = ascdesc.length - 1; i >= 0; i--) {
  $( '#' + ascdesc[i] ).click( function() {
  })
}*/

//----------------------------------------------
// Partie test
var select = "CON1";
dataContenu(select);
fctLiens();
fctHierarchie();
fctAsceDesce();

//##############################################
})