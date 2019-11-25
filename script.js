$(document).ready(function() {
//##############################################
//----------------------------------------------
// hierachie
var dataHierarchie = [
  [1, 'concepts', 'CON', ''],
  [0, 'domaines', 'DOM', 'CON'],
  [0, 'Stades géologiques et de la vie de la Terre', 'GEO', 'DOM'],
  [0, 'Révolutions sociales', 'REV', 'DOM'],
  [0, 'Idee', 'IDE', 'DOM'],
  [0, 'Observations', 'OBS', 'IDE OBH'],
  [0, 'Etudes scientifiques', 'SCI', 'IDE OBH DEH'], 
  [0, 'Mécanismes', 'MEC', 'IDE'],
  [0, 'Grandes Découvertes Humaines', 'DEH', ''],
  [0, 'Observations humaines', 'OBH', 'OBS DEH']
];
//----------------------------------------------
// importer les fichiers
var url = 'https://raw.githubusercontent.com/gdemare/science/master/data/data.json';
var 
  select,
  categorie,
  contenu,
  liens,
  hierarchie,
  hierarAsce, 
  hierarDesce,
  select,
  defaut
;

RequeteDefaut();
function RequeteDefaut () {
  $.getJSON(url, function(data) {

  document.getElementById('defaut').style = "display: flex;";
  document.getElementById('actuel').style = "display: none;";
  document.getElementsByClassName('asc')[0].style = "display: none;";
  document.getElementsByClassName('asc')[1].style = "display: none;";
  document.getElementsByClassName('desc')[0].style = "display: none;";
  document.getElementsByClassName('asc')[1].style = "display: none;";
  document.getElementById('ascendant').innerHTML = "";
  document.getElementById('descendant').innerHTML = "";


    console.log('----------------------------------------------');
    for (var i = dataHierarchie.length - 1; i >= 0; i--) {
      if(dataHierarchie[i][0] == 1) {
        defaut = dataHierarchie[i][2];
      }
    }
    var listeIdDefaut = Object.keys(data[defaut]),
        defautHMTL = "";

    for (var i = listeIdDefaut.length - 1; i >= 0; i--) {
      defautHMTL = defautHMTL + "<div id='" + listeIdDefaut[i] + "' >" + data[defaut][listeIdDefaut[i]].contenu  + "</div>";
    }
    document.getElementById('defaut').innerHTML = defautHMTL;

    for (var i = listeIdDefaut.length - 1; i >= 0; i--) {
      $( '#' + listeIdDefaut[i] ).click( function() {
        select = $(this)[0].id;
       document.getElementById('defaut').innerHTML = "";
       document.getElementById('defaut').style = "display: none;";
       RequeteJson();
       document.getElementById('actuel').style = "display: flex;";
       document.getElementById('ascendant').style = "display: flex;";
       document.getElementById('descendant').style = "display: flex;";
      })
    };
     
  });
}

function RequeteJson() {
  $.getJSON(url, function(data) {

    document.getElementsByClassName('asc')[0].style = "display: flex;";
    document.getElementsByClassName('desc')[0].style = "display: flex;";

    console.log('----------------------------------------------');
    console.log('select id : ' + select);
    categorie= select.slice(0,3); 

    var dataLiens = data["liens"];
    console.log("liens : ok");

    contenu = dataContenu(data, select);
    document.getElementById('actuel').innerHTML = "<div>" + contenu + "</div>";
    console.log('dataContenu : ok');

    liens = fctLiens(dataLiens);
    console.log('fctLiens : ok');

    hierarchie = fctHierarchie(categorie);
    hierarAsce = hierarchie[0];
    hierarDesce = hierarchie[1];
    console.log('fctHierarchie : ok');

    fctAsceDesce(data, liens, hierarAsce, hierarDesce, categorie);
    console.log('fctAsceDesce : ok');

     
    for (var i = liens.length - 1; i >= 0; i--) {
      $( '#' + liens[i] ).click( function() {
        select = $(this)[0].id;
       RequeteJson();
      })
    };
    console.log('boutons : ok');
  });
}

//----------------------------------------------
// recherche dans la table
function dataContenu(data, id) {
  return data[id.slice(0,3)][id].contenu;
};

//----------------------------------------------
// liens
function fctLiens(dataLiens) {
  var ascdesc = [];
  for (var i = dataLiens.length - 1; i >= 0; i--) {
    for (var j = dataLiens[1].length - 1; j >= 0; j--) {
      if (dataLiens[i][j] == select) {
        for (var k = dataLiens[1].length - 1; k >= 0; k--) {
          ascdesc[ascdesc.length] = dataLiens[i][k];
        }
      };
    };
  };
  ascdesc = ascdesc.filter(different);
  return  ascdesc;
}

function different(element) {
  return element != select;
}

//----------------------------------------------
//ascendant/descendant
function fctHierarchie(categorie) {
  hierarAsce = [];
  hierarDesce = [];
  console.log('categorei : ' + categorie);
  for (var i = dataHierarchie.length - 1; i >= 0; i--) {
      var test = dataHierarchie[i][2] == categorie;
      console.log('hierarchie : ' + dataHierarchie[i][2] + '==' + test);
      if (dataHierarchie[i][2] == categorie) {
        console.log('ascendant sans sep : ' + dataHierarchie[i][3]);
        hierarAsce = dataHierarchie[i][3].split(' ');
      };
      if (dataHierarchie[i][3].indexOf(categorie)>-1) {
        hierarDesce.push(dataHierarchie[i][2]);
      };
  }
  var tableHierar = [hierarAsce, hierarDesce];
  return tableHierar;
}

//----------------------------------------------
// separer les id en hierarchie ascendante/descendante
function fctAsceDesce(data, liens, hierarAsce, hierarDesce) {
  var 
    ascendant = "",
    descendant = "";
    console.log(hierarAsce);
    console.log(hierarDesce);
    console.log(liens);
    var contenuDiv;
  for (var i = liens.length - 1; i >= 0; i--) {
    idliens = liens[i].substring(0,3);
    if (hierarDesce!="") {
      contenuDiv = "<div id='" + liens[i] + "' >"
                      + "<span>" + liens[i] + "</span>"
                      + dataContenu(data, liens[i]) + 
                    "</div>"
      if (hierarAsce.indexOf(idliens)>-1) {
        ascendant = ascendant + contenuDiv;
      };
      if (hierarDesce.indexOf(idliens)>-1) {
        descendant = descendant + contenuDiv;
      }
    }
  }
  document.getElementById('ascendant').innerHTML = ascendant;
  document.getElementById('descendant').innerHTML = descendant;
}

$("#home").click( function() {
  RequeteDefaut();
});

//##############################################
var hauteurNav = document.getElementsByTagName("nav")[0].offsetHeight + 'px';
document.getElementById("page").style.setProperty("margin-top", hauteurNav);
// changer les couleurs   
$("#styleCSS").click( function() {
  if ($(this)[0].className.indexOf("dark") == -1) {
    $(this).addClass("dark");
    document.getElementById('page').style.boxShadow = "none";
  } else {
    $(this).removeClass("dark");
    document.getElementById('page').style.boxShadow = "-5px 0px 10px rgb(243,243,243)";
  }
  dark();
});

  dark();
  function dark() {
    var root = document.documentElement;
    if ( document.getElementById("styleCSS").className.indexOf("dark") != -1 ) {
    root.style.setProperty('--color-blue','rgb(64,156,255)');
    root.style.setProperty('--color-blue2','rgb(0,14,34)');
    root.style.setProperty('--color-green','rgb(48, 209, 88)');
    root.style.setProperty('--color-indigo','rgb(94,92,230)');
    root.style.setProperty('--color-orange','rgb(255,159,10)');
    root.style.setProperty('--color-pink','rgb(255,55,95)');
    root.style.setProperty('--color-purple','rgb(191,90,242)');
    root.style.setProperty('--color-red','rgb(255,69,58)');
    root.style.setProperty('--color-teal','rgb(100,210,255)');
    root.style.setProperty('--color-yellow','rgb(255,214,10)');
    root.style.setProperty('--color-gray','rgb(142,142,147)');
    root.style.setProperty('--color-boiteH2','rgb(209,209,214)');
    root.style.setProperty('--color-write','rgb(236,238,240)');
    root.style.setProperty('--color-bouton','rgb(44,44,46)');
    root.style.setProperty('--color-nav','rgb(55,54,63)');
    root.style.setProperty('--color-boite','rgb(55,54,63)');
    root.style.setProperty('--color-fond','rgb(33,32,42)');
    root.style.setProperty('--color-titre','rgb(99,99,102)');
    root.style.setProperty('--color-degrade1','rgb(0,122,255)');
    root.style.setProperty('--color-degrade2','rgb(64,156,255)');
    root.style.setProperty('--color-fondMenu','rgb(29,27,38)');
  } else {
    root.style.setProperty('--color-blue','rgb(0,122,255)');
    root.style.setProperty('--color-blue2','rgb(217,235,255)');
    root.style.setProperty('--color-green','rgb(52,199,89)');
    root.style.setProperty('--color-indigo','rgb(88,86,214)');
    root.style.setProperty('--color-orange','rgb(255,149,0)');
    root.style.setProperty('--color-pink','rgb(255,45,85)');
    root.style.setProperty('--color-purple','rgb(175,82,222)');
    root.style.setProperty('--color-red','rgb(255,59,48)');
    root.style.setProperty('--color-teal','rgb(90,200,250)');
    root.style.setProperty('--color-yellow','rgb(255,204,0)');
    root.style.setProperty('--color-gray','rgb(142,142,147)');
    root.style.setProperty('--color-boiteH2','rgb(50,50,54)');
    root.style.setProperty('--color-write','rgb(118,118,119)');
    root.style.setProperty('--color-bouton','rgb(232,232,232)');
    root.style.setProperty('--color-nav','rgb(247,247,250)');
    root.style.setProperty('--color-boite','rgb(255,255,255)');
    root.style.setProperty('--color-fond','rgb(247,247,250)');
    root.style.setProperty('--color-titre','rgb(180,185,190)');
    root.style.setProperty('--color-degrade1','rgb(0,179,255)');
    root.style.setProperty('--color-degrade2','rgb(76,216,254)');
    root.style.setProperty('--color-fondMenu','rgb(247,247,250)');
  };
};
})
