'use strict';

/************************************************************/
/* Constantes */
/************************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

    toggleDarkModeButton.addEventListener('click', () => {
        if (document.body.hasAttribute('data-theme')) {
            document.body.removeAttribute('data-theme');
            toggleDarkModeButton.textContent = 'Mode Sombre';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            toggleDarkModeButton.textContent = 'Mode Clair';
        }
    });
});

const LARGEUR_PLATEAU = 30;
const HAUTEUR_PLATEAU = 15;
const LARGEUR_CASE = 35;
const HAUTEUR_CASE = 40;
let VITESSE = 500; // Vitesse globale initiale des trains

class Type_de_case {
    static Foret = new Type_de_case('foret');
    static Eau = new Type_de_case('eau');
    static Rail_horizontal = new Type_de_case('rail horizontal');
    static Rail_vertical = new Type_de_case('rail vertical');
    static Rail_droite_vers_haut = new Type_de_case('rail droite vers haut');
    static Rail_haut_vers_droite = new Type_de_case('rail haut vers droite');
    static Rail_droite_vers_bas = new Type_de_case('rail droite vers bas');
    static Rail_bas_vers_droite = new Type_de_case('rail bas vers droite');

    constructor(nom) {
        this.nom = nom;
    }
}

/************************************************************/
// Images
/************************************************************/

const IMAGE_EAU = new Image();
IMAGE_EAU.src = 'images/eau.png';

const IMAGE_FORET = new Image();
IMAGE_FORET.src = 'images/foret.png';

const IMAGE_LOCO = new Image();
IMAGE_LOCO.src = 'images/locomotive.png';

const IMAGE_RAIL_HORIZONTAL = new Image();
IMAGE_RAIL_HORIZONTAL.src = 'images/rail-horizontal.png';

const IMAGE_RAIL_VERTICAL = new Image();
IMAGE_RAIL_VERTICAL.src = 'images/rail-vertical.png';

const IMAGE_RAIL_BAS_VERS_DROITE = new Image();
IMAGE_RAIL_BAS_VERS_DROITE.src = 'images/rail-bas-vers-droite.png';

const IMAGE_RAIL_DROITE_VERS_BAS = new Image();
IMAGE_RAIL_DROITE_VERS_BAS.src = 'images/rail-droite-vers-bas.png';

const IMAGE_RAIL_DROITE_VERS_HAUT = new Image();
IMAGE_RAIL_DROITE_VERS_HAUT.src = 'images/rail-droite-vers-haut.png';

const IMAGE_RAIL_HAUT_VERS_DROITE = new Image();
IMAGE_RAIL_HAUT_VERS_DROITE.src = 'images/rail-haut-vers-droite.png';

const IMAGE_WAGON = new Image();
IMAGE_WAGON.src = 'images/wagon.png';

/************************************************************/
// Classes
/************************************************************/

class Plateau {
    constructor() {
        this.largeur = LARGEUR_PLATEAU;
        this.hauteur = HAUTEUR_PLATEAU;
        this.cases = this.initialiser_cases();
    }

    initialiser_cases() {
        let cases = [];
        for (let x = 0; x < this.largeur; x++) {
            cases[x] = [];
            for (let y = 0; y < this.hauteur; y++) {
                cases[x][y] = Type_de_case.Foret;
            }
        }
        return cases;
    }

    creer_circuit_initial() {
        // Circuit
        this.cases[12][7] = Type_de_case.Rail_horizontal;
        this.cases[13][7] = Type_de_case.Rail_horizontal;
        this.cases[14][7] = Type_de_case.Rail_horizontal;
        this.cases[15][7] = Type_de_case.Rail_horizontal;
        this.cases[16][7] = Type_de_case.Rail_horizontal;
        this.cases[17][7] = Type_de_case.Rail_horizontal;
        this.cases[18][7] = Type_de_case.Rail_horizontal;
        this.cases[19][7] = Type_de_case.Rail_droite_vers_haut;
        this.cases[19][6] = Type_de_case.Rail_vertical;
        this.cases[19][5] = Type_de_case.Rail_droite_vers_bas;
        this.cases[12][5] = Type_de_case.Rail_horizontal;
        this.cases[13][5] = Type_de_case.Rail_horizontal;
        this.cases[14][5] = Type_de_case.Rail_horizontal;
        this.cases[15][5] = Type_de_case.Rail_horizontal;
        this.cases[16][5] = Type_de_case.Rail_horizontal;
        this.cases[17][5] = Type_de_case.Rail_horizontal;
        this.cases[18][5] = Type_de_case.Rail_horizontal;
        this.cases[11][5] = Type_de_case.Rail_haut_vers_droite;
        this.cases[11][6] = Type_de_case.Rail_vertical;
        this.cases[11][7] = Type_de_case.Rail_bas_vers_droite;

        // Segment isolé à gauche
        this.cases[0][7] = Type_de_case.Rail_horizontal;
        this.cases[1][7] = Type_de_case.Rail_horizontal;
        this.cases[2][7] = Type_de_case.Rail_horizontal;
        this.cases[3][7] = Type_de_case.Rail_horizontal;
        this.cases[4][7] = Type_de_case.Rail_horizontal;
        this.cases[5][7] = Type_de_case.Eau;
        this.cases[6][7] = Type_de_case.Rail_horizontal;
        this.cases[7][7] = Type_de_case.Rail_horizontal;

        // Plan d'eau
        for (let x = 22; x <= 27; x++) {
            for (let y = 2; y <= 5; y++) {
                this.cases[x][y] = Type_de_case.Eau;
            }
        }

        // Segment isolé à droite
        this.cases[22][8] = Type_de_case.Rail_horizontal;
        this.cases[23][8] = Type_de_case.Rail_horizontal;
        this.cases[24][8] = Type_de_case.Rail_horizontal;
        this.cases[25][8] = Type_de_case.Rail_horizontal;
        this.cases[26][8] = Type_de_case.Rail_bas_vers_droite;
        this.cases[27][8] = Type_de_case.Rail_horizontal;
        this.cases[28][8] = Type_de_case.Rail_horizontal;
        this.cases[29][8] = Type_de_case.Rail_horizontal;

        // TCHOU
        this.cases[3][10] = Type_de_case.Eau;
        this.cases[4][10] = Type_de_case.Eau;
        this.cases[4][11] = Type_de_case.Eau;
        this.cases[4][12] = Type_de_case.Eau;
        this.cases[4][13] = Type_de_case.Eau;
        this.cases[5][10] = Type_de_case.Eau;

        this.cases[7][10] = Type_de_case.Eau;
        this.cases[7][11] = Type_de_case.Eau;
        this.cases[7][12] = Type_de_case.Eau;
        this.cases[7][13] = Type_de_case.Eau;
        this.cases[8][10] = Type_de_case.Eau;
        this.cases[9][10] = Type_de_case.Eau;
        this.cases[8][13] = Type_de_case.Eau;
        this.cases[9][13] = Type_de_case.Eau;

        this.cases[11][10] = Type_de_case.Eau;
        this.cases[11][11] = Type_de_case.Eau;
        this.cases[11][12] = Type_de_case.Eau;
        this.cases[11][13] = Type_de_case.Eau;
        this.cases[12][11] = Type_de_case.Eau;
        this.cases[13][10] = Type_de_case.Eau;
        this.cases[13][11] = Type_de_case.Eau;
        this.cases[13][12] = Type_de_case.Eau;
        this.cases[13][13] = Type_de_case.Eau;

        this.cases[15][10] = Type_de_case.Eau;
        this.cases[15][11] = Type_de_case.Eau;
        this.cases[15][12] = Type_de_case.Eau;
        this.cases[15][13] = Type_de_case.Eau;
        this.cases[16][10] = Type_de_case.Eau;
        this.cases[16][13] = Type_de_case.Eau;
        this.cases[17][10] = Type_de_case.Eau;
        this.cases[17][11] = Type_de_case.Eau;
        this.cases[17][12] = Type_de_case.Eau;
        this.cases[17][13] = Type_de_case.Eau;

        this.cases[19][10] = Type_de_case.Eau;
        this.cases[19][11] = Type_de_case.Eau;
        this.cases[19][12] = Type_de_case.Eau;
        this.cases[19][13] = Type_de_case.Eau;
        this.cases[20][13] = Type_de_case.Eau;
        this.cases[21][10] = Type_de_case.Eau;
        this.cases[21][11] = Type_de_case.Eau;
        this.cases[21][12] = Type_de_case.Eau;
        this.cases[21][13] = Type_de_case.Eau;
    }
}

class Train {
    constructor(x, y, direction, wagons, vitesse) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.wagons = wagons || [];
        this.vitesse = vitesse;
        this.disparcouru = 0; 
    }

    avancer(plateau) {
        let suivantX = this.x;
        let suivantY = this.y;

        switch (this.direction) {
            case 'droite':
                suivantX += 1;
                break;
            case 'gauche':
                suivantX -= 1;
                break;
            case 'haut':
                suivantY -= 1;
                break;
            case 'bas':
                suivantY += 1;
                break;
        }

        if (suivantX < 0 || suivantX >= plateau.largeur || suivantY < 0 || suivantY >= plateau.hauteur) {
            return false; //train hors plateau
        }

        const casesuivant = plateau.cases[suivantX][suivantY];
        if (this.case_incompatible(casesuivant)) {
            return false; 
            // /case incompatible
        }

        // changer direction
        switch (casesuivant) {
            case Type_de_case.Rail_droite_vers_haut:
                this.direction = this.direction === 'droite' ? 'haut' : 'gauche';
                break;
            case Type_de_case.Rail_haut_vers_droite:
                this.direction = this.direction === 'haut' ? 'droite' : 'bas';
                break;
            case Type_de_case.Rail_droite_vers_bas:
                this.direction = this.direction === 'droite' ? 'bas' : 'gauche';
                break;
            case Type_de_case.Rail_bas_vers_droite:
                this.direction = this.direction === 'bas' ? 'droite' : 'haut';
                break;
        }
        if (this.wagons.length > 0) {
            for (let i = this.wagons.length - 1; i > 0; i--) {
                this.wagons[i].x = this.wagons[i - 1].x;
                this.wagons[i].y = this.wagons[i - 1].y;
            }
            this.wagons[0].x = this.x;
            this.wagons[0].y = this.y;
        }

        this.x = suivantX;
        this.y = suivantY;
        this.disparcouru += 1; 

        return true;
    }

    case_incompatible(type_de_case) {
        if (type_de_case === Type_de_case.Eau || type_de_case === Type_de_case.Foret) {
            return true;
        }
        switch (type_de_case) {
            case Type_de_case.Rail_horizontal:
                return this.direction !== 'droite' && this.direction !== 'gauche';
            case Type_de_case.Rail_vertical:
                return this.direction !== 'haut' && this.direction !== 'bas';
            case Type_de_case.Rail_droite_vers_haut:
                return this.direction !== 'droite' && this.direction !== 'bas';
            case Type_de_case.Rail_haut_vers_droite:
                return this.direction !== 'haut' && this.direction !== 'gauche';
            case Type_de_case.Rail_droite_vers_bas:
                return this.direction !== 'droite' && this.direction !== 'haut';
            case Type_de_case.Rail_bas_vers_droite:
                return this.direction !== 'bas' && this.direction !== 'gauche';
            default:
                return true;
        }
    }

    changerdrection() {
        const directions = ['droite', 'bas', 'gauche', 'haut'];
        const index = directions.indexOf(this.direction);
        this.direction = directions[(index + 1) % 4];
    }

    getPositions() {
        let positions = [{ x: this.x, y: this.y }];
        for (let wagon of this.wagons) {
            positions.push({ x: wagon.x, y: wagon.y });
        }
        return positions;
    }
}

class Wagon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Simulateur {
    constructor(context) {
        this.context = context;
        this.plateau = new Plateau();
        this.trains = [];
        this.selectedType = null; 
        this.selectedTrain = null; 
        this.enPause = false; 
        this.initEvent(); 
        this.commencersimulation(); 
    }

    demarrer() {
        this.plateau.creer_circuit_initial();
        this.dessiner();
    }

    mettre_a_jour() {

        if (!this.enPause) {
            for (let i = this.trains.length - 1; i >= 0; i--) {
                const train = this.trains[i];
                if (!train.avancer(this.plateau)) {
                    this.trains.splice(i, 1); 
                }
            }
            this.verifierCollision(); 
            this.dessiner();
        }
    }

    dessiner() {
        dessine_plateau(this.context, this.plateau);
        this.trains.forEach(train => this.dessiner_train(train));
        dessinerMeteo(this.context);
    }

    initEvent() {
        const buttonMapping = {
            "bouton_foret": Type_de_case.Foret,
            "bouton_eau": Type_de_case.Eau,
            "bouton_rail_horizontal": Type_de_case.Rail_horizontal,
            "bouton_rail_vertical": Type_de_case.Rail_vertical,
            "bouton_rail_droite_vers_haut": Type_de_case.Rail_droite_vers_haut,
            "bouton_rail_haut_vers_droite": Type_de_case.Rail_haut_vers_droite,
            "bouton_rail_droite_vers_bas": Type_de_case.Rail_droite_vers_bas,
            "bouton_rail_bas_vers_droite": Type_de_case.Rail_bas_vers_droite
        };

        const trainButtonMapping = {
            "bouton_train_1": 0,
            "bouton_train_2": 1,
            "bouton_train_4": 3,
            "bouton_train_6": 5
        };

        for (const [buttonId, caseType] of Object.entries(buttonMapping)) {
            document.getElementById(buttonId).addEventListener('click', () => {
                this.selectedType = caseType;
                this.selectedTrain = null; // Désélectionner le train si un type de case est sélectionné
                this.updateButtonSelection(buttonId, 'case');
            });
        }

        for (const [buttonId, wagonsCount] of Object.entries(trainButtonMapping)) {
            document.getElementById(buttonId).addEventListener('click', () => {
                this.selectedTrain = wagonsCount;
                this.selectedType = null; // Désélectionner le type de case si un train est sélectionné
                this.updateButtonSelection(buttonId, 'train');
            });
        }

        document.getElementById('simulateur').addEventListener('click', (event) => {
            const rect = event.target.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / LARGEUR_CASE);
            const y = Math.floor((event.clientY - rect.top) / HAUTEUR_CASE);

            if (this.selectedType) {
                this.plateau.cases[x][y] = this.selectedType;
                this.dessiner();
            }

            if (this.selectedTrain !== null) {
                const trainSpeed = parseInt(document.getElementById('train-speed').value, 10);
                this.ajouter_train(x, y, this.selectedTrain, trainSpeed);
            } else {
                this.trains.forEach(train => {
                    if (train.x === x && train.y === y) {
                        train.changerdrection();
                        this.dessiner();
                    }
                });
            }
        });

        // Gestion du bouton de pause
        document.getElementById('bouton_pause').addEventListener('click', () => {
            this.enPause = !this.enPause;
            document.getElementById('bouton_pause').innerText = this.enPause ? 'Redémarrer' : 'Pause';
        });

        // Gestion des champs de saisie pour la vitesse
        document.getElementById('global-speed').addEventListener('change', (event) => {
            VITESSE = parseInt(event.target.value, 10);
        });
    }

    updateButtonSelection(selectedButtonId, type) {
        const buttons = document.querySelectorAll('#boutons input[type="image"]');
        buttons.forEach(button => {
            if (button.id === selectedButtonId) {
                button.disabled = true;
            } else {
                button.disabled = false;
            }
        });

        // Désactiver les boutons de type opposé
        if (type === 'case') {
            const trainButtons = document.querySelectorAll('#boutons input[id^="bouton_train"]');
            trainButtons.forEach(button => button.disabled = false);
        } else if (type === 'train') {
            const caseButtons = document.querySelectorAll('#boutons input[id^="bouton_"]');
            caseButtons.forEach(button => button.disabled = false);
        }
    }

    ajouter_train(x, y, wagonsCount, vitesse) {
        // Vérifier que le train est ajouté sur un rail horizontal et qu'il ne chevauche pas un autre train
        if (this.plateau.cases[x][y] !== Type_de_case.Rail_horizontal) return;
        for (let i = 0; i <= wagonsCount; i++) {
            if (x - i < 0 || this.plateau.cases[x - i][y] !== Type_de_case.Rail_horizontal) return;
            for (const train of this.trains) {
                if (train.x === x - i && train.y === y) return;
                for (const wagon of train.wagons) {
                    if (wagon.x === x - i && wagon.y === y) return;
                }
            }
        }

        const wagons = [];
        for (let i = 1; i <= wagonsCount; i++) {
            wagons.push(new Wagon(x - i, y));
        }
        const train = new Train(x, y, 'droite', wagons, vitesse);
        this.trains.push(train);
        this.dessiner();
    }

    dessiner_train(train) {
        this.context.drawImage(IMAGE_LOCO, train.x * LARGEUR_CASE, train.y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
        train.wagons.forEach(wagon => {
            this.context.drawImage(IMAGE_WAGON, wagon.x * LARGEUR_CASE, wagon.y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
        });
    }

    commencersimulation() {
        setTimeout(() => {
            this.mettre_a_jour();
            this.commencersimulation();
        }, VITESSE);
    }

    verifierCollision() {
        let positions = new Map();

        for (let train of this.trains) {
            let trainPositions = train.getPositions();

            for (let pos of trainPositions) {
                let key = `${pos.x},${pos.y}`;
                if (positions.has(key)) {
                    positions.get(key).push(train);
                } else {
                    positions.set(key, [train]);
                }
            }
        }

        let collisions = [];
        for (let [key, trains] of positions.entries()) {
            if (trains.length > 1) {
                collisions.push(...trains);
            }
        }

        if (collisions.length > 0) {
            this.trains = this.trains.filter(train => !collisions.includes(train));
        }
    }
}

/************************************************************/
// Méthodes
/************************************************************/

function image_of_case(type_de_case) {
    switch (type_de_case) {
        case Type_de_case.Foret:
            return IMAGE_FORET;
        case Type_de_case.Eau:
            return IMAGE_EAU;
        case Type_de_case.Rail_horizontal:
            return IMAGE_RAIL_HORIZONTAL;
        case Type_de_case.Rail_vertical:
            return IMAGE_RAIL_VERTICAL;
        case Type_de_case.Rail_droite_vers_haut:
            return IMAGE_RAIL_DROITE_VERS_HAUT;
        case Type_de_case.Rail_haut_vers_droite:
            return IMAGE_RAIL_HAUT_VERS_DROITE;
        case Type_de_case.Rail_droite_vers_bas:
            return IMAGE_RAIL_DROITE_VERS_BAS;
        case Type_de_case.Rail_bas_vers_droite:
            return IMAGE_RAIL_BAS_VERS_DROITE;
    }
}

function dessine_case(context, plateau, x, y) {
    const la_case = plateau.cases[x][y];
    let image_a_afficher = image_of_case(la_case);
    context.drawImage(image_a_afficher, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
}

function dessine_plateau(context, plateau) {
    for (let x = 0; x < plateau.largeur; x++) {
        for (let y = 0; y < plateau.hauteur; y++) {
            dessine_case(context, plateau, x, y);
        }
    }
}

let meteoActuelle = 'soleil'; 

function changerMeteo(nouvelleMeteo) {
    meteoActuelle = nouvelleMeteo;
    dessinerMeteo(contexte);
}

function dessinerMeteo(context) {
    const canvas = context.canvas;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    dessine_plateau(context, simulateur.plateau);
    simulateur.trains.forEach(train => simulateur.dessiner_train(train));
    context.restore();

    if (meteoActuelle === 'pluie') {
        dessinerPluie(context);
    } else if (meteoActuelle === 'neige') {
        dessinerNeige(context);
    }
}

// pluie
function dessinerPluie(context) {
    context.fillStyle = 'rgba(0, 0, 255, 0.5)';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * context.canvas.width;
        const y = Math.random() * context.canvas.height;
        context.fillRect(x, y, 2, 10);
    }
}

// neige
function dessinerNeige(context) {
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * context.canvas.width;
        const y = Math.random() * context.canvas.height;
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fill();
    }
}

document.querySelectorAll('#meteo button').forEach(button => {
    button.addEventListener('click', (event) => {
        const meteo = event.target.getAttribute('data-meteo');
        changerMeteo(meteo);
    });
});

/************************************************************/
// Programme principal
/************************************************************/
window.addEventListener("load", () => {
    const contexte = document.getElementById('simulateur').getContext("2d");
    window.simulateur = new Simulateur(contexte);
    simulateur.demarrer();
});
