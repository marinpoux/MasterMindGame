//constantes :
const nbLignes = 10;
const nbCases = 4;

//variables :
var compteur = 0;
    //compte le nombre de manches/tours
var victoire = false;
    //devient true si la combinaison proposée par le joueur est identique à celle générée

var couleurs = ['bleu', 'vert', 'jaune', 'rouge', 'blanc', 'noir'];
    //tableau des noms des couleurs affichées dans les listes
var rvbCodes = ['#0000ff', '#00cc00', '#ffff00', '#ff0000', '#ffffff', '#000000'];
    //tableau des valeurs hexadécimales des couleurs

var randCode = [];
    //stocke la combinaison de chiffres aléatoires générée
var randCoul = [];
    //stocke la valeur hexadécimale de la couleur correspondante à chaque valeur de randCode

var stockTemp = [];
    //stocke temporairement la combinaison saisie par l'utilisateur (hexadécimale)
var indiceTemp = [];
    //stocke temporairement les indicateurs de comparaison entre la combinaison du joueur et celle générée


//afficher des éléments concernés
function masqueOff(classe) {
    document.querySelector('.'+ classe).classList.add('flex');
    document.querySelector('.'+ classe).classList.remove('masqueOn');
}

//masquer des éléments concernés
function masqueOn(classe) {
    document.querySelector('.'+ classe).classList.add('masqueOn');
    document.querySelector('.'+ classe).classList.remove('masqueOff');
} 

//génération du code à trouver
function randomCode() {

    for (var i=0; i<nbCases; i++) {

        //génération d'un code aléatoire de 4 chiffres de 0 à 5 (6 options)
        nbTemp = Math.round(Math.random()*10);
        while (nbTemp >= couleurs.length) {
            nbTemp = Math.round(Math.random()*10);
        }

        randCode.push(nbTemp);

        //association des valeurs hexadécimales correspondantes
        //stockage dans randCoul
        for (var l=0; l< rvbCodes.length; l++) {
            if (randCode[i] == l) {
                randCoul[i] = rvbCodes[l];
            }
        }
    }

    console.log("code généré: "+ randCode);
    console.log("code généré: "+ randCoul);
}

/*************************************** génération des div ***************************************** */

//génération du 'plateau' de jeu
function plateau() {

    for (var i=0; i< nbLignes*2; i++) {

        var iTemp = Math.trunc(Number(i) /2);
    
        document.write(
            "<div ");
    
        if (i % 2 == 0) { 
            //div affichant les combinaisons de couleurs envoyées par l'utilisateur
            document.write("id='place" + (iTemp) +
                "' name='place" + (iTemp) +
                "' class='placement");
        } else {
            //div affichant les indicateurs de comparaison entre la saisie de l'utilisateur
            //  et le code à trouver
            document.write("id='indic" + (iTemp) +
            "' name='indic" + (iTemp) +
            "' class='indicateur");
        }

        document.write(" plateau flex'>");
        document.write("</div>");
        
    }
}

//génération des div représentant les couleurs
function pions(idNom, classe) {

    for (var j=0; j<nbCases; j++) {

        document.write(
            "<div id='" + idNom + j + 
            "' name='" + idNom + j + 
            "' class='" + classe + "'>"
        );
        document.write("</div>");
    }
}

/*************************************** interface joueur ***************************************** */

//génération des listes de sélection de couleur
function listes() {

    for (var j = 0; j < nbCases; j++) {

        document.write(
            "<select id='select" + j +
            "' name='selection" + j +
            "' class='listeSelect' onchange='selectCouleur(" + j +
            ")'>"
        );

        for (var k = -1; k < couleurs.length; k++) {

            if (k == -1) {
                document.write(
                    "<option value='transparent' selected>" +
                    "couleur" +
                    "</option>"
                );
            } else {
                document.write(
                    "<option value=" + rvbCodes[k] + ">" +
                    couleurs[k] +
                    "</option>"
                );
            }
        }

        document.write("</select>");
    }
}

//affichage visuel la couleur sélectionnée
function selectCouleur(nbPionListe) {
    //récupération du code hexadécimal du tableau rvbCode associée à l'élément sélectionné dans la liste
    //application de cette couleur au background du div correspondant à la liste sélectionnée

    document.getElementById('visu' + nbPionListe).style.backgroundColor
        = document.getElementById('select' + nbPionListe).options[document.getElementById('select' + nbPionListe).selectedIndex].value;

    //console.log('la couleur sélectionnée est ' + document.getElementById('select' + nbPionListe).options[document.getElementById('select' + nbPionListe).selectedIndex].value);
    //console.log(document.getElementById('visu' + nbPionListe));
}

/*************************************** controles ***************************************** */

//valider la combinaison du joueur
function valider() {
    var compTemp = 0;

    //console.log(compTemp);

    for (var j=0; j<nbCases; j++) {
        if (document.getElementById('select' + j).options[document.getElementById('select' + j).selectedIndex].value == 'transparent') {
            alert('Vous devez choisir une couleur.');
            break;
        } else {
            stockTemp.push(document.getElementById('select' + j).options[document.getElementById('select' + j).selectedIndex].value);

            compTemp++;

            //console.log(compTemp);
            //console.log(stockTemp);
        }
    }   

    if (compTemp == nbCases) {
        miseAJour();
    }
}

//mise à jour de l'interface
function miseAJour() {

    //comparaison du résultat envoyé au code généré
    comparaison();    //permet de changer victoire = true;

    //si la victoire n'a pas été déclarée
    if (victoire != true) {

        //applique la combinaison validée à la ligne concernée + indices
        majPlateau();

        //mise à jour du compteur de tours
        compteur ++;

        //vérification du compteur
        verifCompt();

        //réinitialisation des listes de couleurs
        reinitListe();
    }
}

/******************* fonctions appelées par miseAJour() ********************/

function comparaison() {
    var compTemp = 0 ;
        //compte nombre de couleurs bien positionnées

    for (var m=0; m<nbCases; m++) {
        if (stockTemp[m] == randCoul[m]) {
            //comparaison couleurs bien positionnées
                
            indiceTemp.push('black');
            compTemp++;
                
        } else if (randCoul.includes(stockTemp[m]) ) {
            //comparaison couleurs présentes DANS LA MEME BOUCLE FOR!!!!
    
            indiceTemp.push('white');
    
        } else {
            //pas dans la combinaison
                
            indiceTemp.push('transparent');
        }
    }

    if (compTemp == 4) {
        //si toutes les couleurs sont bien positionnées, c'est la victoire!

        console.log("victoire");

        victoire = true;
        codeSoluce();

    }

    console.log(indiceTemp);

}

//mise à jour du plateau:
//  application des couleurs
//  affichage des indices
function majPlateau() {

    //création des nouveau div
    genePlaceInd('place' ,'place', 'cellule', stockTemp);
    genePlaceInd('indic', 'indice', 'indice', indiceTemp);
 
}

    //création des div à ajouter dans le plateau
    function genePlaceInd (idDiv, idNom, classe, tabCoul) {
        //idDiv: id du DIV parent
        //idNom: utiliser pour identifier et nommer les nouveaux div
        //tabCoul: tableau stockant les couleurs

        var divTemp = document.getElementById(idDiv + compteur);

        for (var j=0; j<nbCases; j++) {

            var pion = document.createElement('div');
                pion.id = "tour" + compteur + "-" + idNom + j;
                pion.name = "tour" + compteur + "-" + idNom + j;
                pion.classList.add(classe);

                //application de la couleur
                pion.style.backgroundColor = tabCoul[j];

            divTemp.appendChild(pion);
        }
    }

//vérifie si la partie est terminée
function verifCompt() {
    if ((compteur >= nbLignes) && (victoire == false)) {
        codeSoluce();
    }

    console.log('compteur : ' + compteur);
}

//réinitialisation des listes de couleurs
function reinitListe() {

    stockTemp = [];
    indiceTemp = [];

    for (var m=0; m<nbCases; m++) {
        document.getElementById('visu' + m).style.backgroundColor = 'transparent';
        document.getElementById('select' + m).options[0].selected = 'transparent';
    }

    console.log('sélection réinitialisée');
}


//affichage visuel du code généré aléatoirement
//s'affiche en fin de partie (victoire ou défaite du joueur)
function codeSoluce() {

    if (victoire == true) {
        document.getElementById('solution').innerHTML = "Vicoire !!";
    }

    document.getElementById('contSoluce').style.visibility = 'visible';
    document.getElementById('valid').disabled = true;

    for (var l=0; l<nbCases; l++) {

        console.log('soluce' + l);
        console.log(randCoul[l]);

        document.getElementById('soluce' + l).style.backgroundColor = randCoul[l];
    }

}

/************************* bouton "recommencer" *****************************/

//recharger la page
function recommencer() {
    if (confirm("Réessayer?")) {
        document.location.reload();
    }    
}
