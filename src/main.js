import './style.css'

const app = document.getElementById("app");

const images = [
  "bunny.jpeg","dog.jpeg","fox.jpeg","mouse.jpeg","owl.jpeg","whale.jpeg",
  "alpaca.jpeg","cat.jpeg","chick.jpeg","hedgehog.jpeg","koala.jpeg",
  "panda.jpeg","parrot.jpeg","penguin.jpeg","raccoon.jpeg",
  "shark.jpeg","sloth.jpeg","tiger.jpeg",
];

app.innerHTML = `
    <div class="container">
      <div id="ecran-accueil" class="ecran">
        <img src="/logo.png" alt="Memo Kawaii" class="logo">
        <button id="btn-jouer">Jouer !</button>
      </div>

      <div id="ecran-jeu" class="ecran hidden">
        <img src="/logo.png" alt="Memo Kawaii" class="logo-petit">
        
        <div class="zone-score">
          Coups : <span id="compteur-coups">0</span> | 
          Temps : <span id="compteur-temps">0</span>s
        </div>
        
        <div id="grille"></div>
        <button id="btn-rejouer-jeu"></button>
      </div>

      <div id="ecran-fin" class="ecran hidden">
        <img src="/logo.png" alt="Memo Kawaii" class="logo">
        <img src="/win.png" alt="Gagné !" class="img-gagne">
        
        <div class="score-final">
          Bravo ! Tu as réussi en <span id="score-final-coups">0</span> coups 
          et <span id="score-final-temps">0</span> secondes !
        </div>
        
        <button id="btn-rejouer-fin"></button>
      </div>

    </div>
`;


// -------------------- VARIABLES ------------------------------

let tableau = [];
let cartesRetournees = [];
let pairesTrouvees = 0;
const pairesTotales = 8;
let clicsTotaux = 0;
let nombreDeCoups = 0;

// NOUVELLES VARIABLES POUR LE TIMER
let tempsEcoule = 0;
let chronoInterval = null;

// -------------------- GET ELEMENT ------------------------------

const ecranAccueil = document.getElementById("ecran-accueil");
const ecranJeu = document.getElementById("ecran-jeu");
const ecranFin = document.getElementById("ecran-fin");

const grille = document.getElementById("grille");
const btnJouer = document.getElementById("btn-jouer");
const btnRejouerJeu = document.getElementById("btn-rejouer-jeu");
const btnRejouerFin = document.getElementById("btn-rejouer-fin");

const compteurCoups = document.getElementById("compteur-coups");
const scoreFinalCoups = document.getElementById("score-final-coups");

const compteurTemps = document.getElementById("compteur-temps");
const scoreFinalTemps = document.getElementById("score-final-temps");


// -------------------- EVENTS ------------------------------

btnJouer.addEventListener("click", lancerJeu);
btnRejouerJeu.addEventListener('click', lancerJeu);
btnRejouerFin.addEventListener('click', lancerJeu);


// -------------------- FONCTIONS ------------------------------

function lancerJeu () {
  ecranAccueil.classList.add("hidden");
  ecranFin.classList.add("hidden");
  ecranJeu.classList.remove("hidden");
  
  nombreDeCoups = 0;
  compteurCoups.textContent = nombreDeCoups;

  tempsEcoule = 0;
  compteurTemps.textContent = tempsEcoule;
  
  clearInterval(chronoInterval);
  chronoInterval = setInterval(mettreAJourChrono, 1000); 
  
  creerGrille();
}


function mettreAJourChrono() {
  tempsEcoule++;
  compteurTemps.textContent = tempsEcoule;
  console.log("Seconde écoulée : " + tempsEcoule);
}

function creerGrille() {
  grille.innerHTML = ""; 
  cartesRetournees = [];
  pairesTrouvees = 0;

  const imagesChoisies = images.slice(0, pairesTotales);
  
  tableau = [...imagesChoisies, ...imagesChoisies];
  
  tableau.sort(() => Math.random() - 0.5);

  tableau.forEach((nomImage) => {
    const carteDiv = document.createElement("div");
    carteDiv.classList.add("carte");
    carteDiv.dataset.image = nomImage; 

    carteDiv.innerHTML = `
      <div class="carte-inner">
        <div class="carte-front">
          <img src="/back.jpeg" alt="Dos de la carte">
        </div>
        <div class="carte-back">
          <img src="/${nomImage}" alt="Animal">
        </div>
      </div>
    `;

    carteDiv.addEventListener("click", () => retournerCarte(carteDiv));
    
    grille.appendChild(carteDiv);
  });
}

function retournerCarte(carte) {
  clicsTotaux++ ;
  if (cartesRetournees.length >= 2 || carte.classList.contains("flipped") === true) {
    return;
  }

  console.log("carte retournée : " + carte.dataset.image);
  console.log("clics : " + clicsTotaux);

  carte.classList.add("flipped");
  cartesRetournees.push(carte);

  if (cartesRetournees.length === 2) {
    nombreDeCoups++;
    compteurCoups.textContent = nombreDeCoups;

    verifierPaire();
  }
}

function verifierPaire() {
  const carte1 = cartesRetournees[0];
  const carte2 = cartesRetournees[1];

  if (carte1.dataset.image === carte2.dataset.image) {
    pairesTrouvees++;
    console.log("nombres trouvées : " + pairesTrouvees)
    cartesRetournees = []; 

    if (pairesTrouvees === pairesTotales) {
      clearInterval(chronoInterval);
      setTimeout(afficherEcranFin, 600);
    }
  } else {
    setTimeout(() => {
      carte1.classList.remove("flipped");
      carte2.classList.remove("flipped");
      cartesRetournees = [];
    }, 1000);
  }
}

function afficherEcranFin() {
  scoreFinalCoups.textContent = nombreDeCoups;
  scoreFinalTemps.textContent = tempsEcoule;

  console.log("nbr coups :" + compteurCoups);
  console.log("nombre tot de clics : " + clicsTotaux);
  console.log("temps pris : " + tempsEcoule)

  ecranJeu.classList.add("hidden");
  ecranFin.classList.remove("hidden");
}