const UrlAPI = "http://localhost:5678/api/";

let works = [];

//recupération des travaux depuis l'api//
const GetWorks = async (FiltredCat = false) => {
    try {
        const r = await fetch(UrlAPI + 'works', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
        });

        const data = await r.json();

        works = data; 

        window.localStorage.setItem('works', JSON.stringify(works));

        if (FiltredCat) {
            GalleryCreate(FiltredCat);
        } else {
            GalleryCreate(works);
        }

    } catch (error) {
        alert(error.message);
        throw error;
    }
}
//recuperation des catégories depuis l'api //
const GetCatergories = async () => {
    const r = await fetch(UrlAPI + 'categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const categories = await r.json();

    const filtre = document.querySelector("#filtre");
    
    let display = ''

    // création du bouton filtre tous + catégories//
    display += `<button class='btn' id="Tous"> Tous </button>` ;
    for (cat of categories) {
        display += `<button data-category-id='${cat.id}' class='btn' id='${cat.id}'>${cat.name}</button>` ;
    }

    filtre.insertAdjacentHTML('beforeend', display);

    let Button = filtre.querySelectorAll('.btn');
    for (let i = 0; i < Button.length; i++) {
        Button[i].addEventListener('click', CategoriesPICK);
    }
}
//trie des travaux en fonction du boutton appuyé//
const CategoriesPICK = (event) => {
    const works = JSON.parse(localStorage.getItem('works'));
    if (event.target.nodeName === 'BUTTON' && event.target.id === 'Tous') {
        GetWorks();
    } else if (event.target.nodeName === 'BUTTON' && event.target.id) {
        const FiltredCat = works.filter(i => i.categoryId == `${event.target.dataset.categoryId}`);

        GetWorks(FiltredCat);
    }
}
//crée une figure pour chaque travaux sur l'api //
const GalleryCreate = (works) => {
    const container = document.querySelector(".gallery");
    container.innerHTML = '' ;
    let display = '' ;
    for (Prod of works) {
        display += `
                <figure>
                    <img src="${Prod.imageUrl}" alt="${Prod.title}">
                    <figcaption>${Prod.title}</figcaption>
                </figure>`;
    }

    container.insertAdjacentHTML('beforeend', display);
}

GetWorks();
GetCatergories();

token = localStorage.getItem("token");
// si user connecté modification du bouton login en logout et ajout de la deconnexion//
if (!!token) {
    logout = document.getElementById("log");
    logout.innerHTML = "<a href='#'>logout</a>";
    logout.addEventListener('click', event => {
        localStorage.removeItem("token");
        window.location.reload();
    });


    filtre.style.visibility = "hidden";
    //ajout du bandeau noir en haut de l'écran//
    const header = document.getElementById('header');
    let display = '' ;
    display += ` 
                    <div class="blackBloc">
                        <button id="Edit1" class="editBtn">
                            <i class="fa-regular fa-pen-to-square"></i> 
                            Mode édition
                        </button>
                        <button class="Change">
                            publier les changements
                        </button>
                    </div>`;

    header.insertAdjacentHTML('beforebegin', display);

    change = document.querySelector(".Change");
    change.addEventListener('click', event => {
        localStorage.removeItem("token");
        window.location.reload();
    });
    //ajout des boutons de modification//
    const TProjet = document.getElementById('Tprojet');
    const intro = document.getElementById('introduction');
    const fig = intro.querySelector('figure');
    let display1 = '' ;
    display1 += `
                    <button id="Edit2" class="editBtn">
                        <i class="fa-regular fa-pen-to-square"></i> 
                        modifier
                    </button>`;

    TProjet.insertAdjacentHTML('afterbegin', display1);
    fig.insertAdjacentHTML('beforeend', display1);

}