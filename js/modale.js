

let display = '';
display += `
                    <div id="myModal" class="modal">


                        <div class="modal-content">
                            <div class="modal-header">
                                <span class="close">&times;</span>
                                <span class="back">&#8592;</span>
                                <h2 class="Title1">Galerie photo</h2>
                                <h2 class="Title2">Ajout Photo<h2>
                            </div>
                            <div class="modal-body">
                            <form id="form">
                              <div class="body2-modalfile">
                                <i class="fa-regular fa-image fa-2xl"></i>
                                <input type="file" class="Modalfile" id="modalfile" onchange ="ImagePreview(event)">
                                <label for="modalfile">+ Ajouter photo</label>
                                <div id="preview"></div>
                                <span>jpg, png : 4mo max</span>
                              </div>
                              <div class="body2-modaltitle">
                                  <label for="titre" class="label">Titre</label>
                                  <input type="text" class="labelModal" id="titre" name="titre">
                              </div>
                              <div class="body2-modalcat">
                                  <label for="cat" class="cat">Catégorie</label>
                                  <select name="catégories" id="cat">
                                  </select>
                              </div>
                            </form>
                            </div>
                            <div class="modal-footer">
                                <button class="AddPic">Ajouter une photo</button>
                                <button class="deleteAllPic">Supprimer la galerie</button>
                                <button class="Valid">Valider</button>
                            </div>
                        </div>

                    </div>`;

const portfolio = document.getElementById('portfolio');
portfolio.insertAdjacentHTML('afterbegin', display);

//ouvre la modal si click sur bouton//

var modal = document.getElementById("myModal");
var btn = document.getElementsByClassName("editBtn");
for (var i = 0; i < btn.length; i++) {
  btn[i].addEventListener('click',  () => {
    modal.style.display = "block";
  }, false);
}

//Affichage des catégories dynamique dans la modal//

const GetCat = async () =>{
  const UrlAPICat = await fetch("http://localhost:5678/api/categories");
    const cat = await UrlAPICat.json();
    const select = document.querySelector("#cat");
    for (const option of cat) {
      const opt = document.createElement("option");
      opt.value = option.id;
      opt.text = option.name;
      select.appendChild(opt);  
    }
}

GetCat();

//Ferme la modal si click sur bouton X ou click en dehors de la modale//

let close = document.getElementsByClassName("close")[0];

close.onclick = () => {
  modal.style.display = "none";
  resetForm();
  clickBack();
}

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    resetForm();
    clickBack();
  }
}

//Récupere les travaux et les affiches dans la modal//

const UrlAPIworks = "http://localhost:5678/api/works";

const DisplayPro = async () => {
  try {
    const r = await fetch(UrlAPIworks);
    if (!r.ok) {
      if (r.status === 500) {
        throw new Error("Unknow Error");
      }
    }

    const works = await r.json();
    const modalbody = document.querySelector('.modal-body');
    //création element dans le body de la modal//
    for (const figure of works) {

      const figuremodal = document.createElement("figure");
      figuremodal.classList.add("modal-figure");

      const imgmodal = document.createElement("img");
      imgmodal.classList.add("modal-img");
      imgmodal.src = figure.imageUrl;
      imgmodal.alt = figure.title;

      const capmodal = document.createElement("figcaption");
      const linkcap = document.createElement("a");
      capmodal.href = "#";
      linkcap.textContent = "éditer";

      const deleteBtn = document.createElement("div");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.dataset.figureId = figure.id;
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash-can");

      //suppresion projet ?//
      deleteBtn.addEventListener("click", async () => {
        if (confirm("Supprimer ce projet ?")) {
          await DeleteFigure(figure.id);
        }
      });

      figuremodal.appendChild(imgmodal);
      figuremodal.appendChild(deleteBtn);
      deleteBtn.appendChild(deleteIcon);
      capmodal.appendChild(linkcap);
      figuremodal.appendChild(capmodal);
      modalbody.appendChild(figuremodal);

    }
  } catch (error) {
    console.log(error);
  }
}

//récupere les differents parties du code a afficher ou caché en fonction de la modal désiré//
let Valid = document.querySelector(".Valid");
let body2t = document.querySelector(".body2-modaltitle");
let body2c = document.querySelector(".body2-modalcat");
let Title2 = document.querySelector(".Title2");
let Back = document.querySelector(".back");
let Title1 = document.querySelector(".Title1");
let AddPic = document.querySelector(".AddPic");
let DelPic = document.querySelector(".deleteAllPic");
let modalfile = document.querySelector(".body2-modalfile");

//passage modal ajout projet //
const clickAdd = () => {
  Title1.style.display = "none";
  AddPic.style.display = "none";
  DelPic.style.display = "none";
  Back.style.display = "block";
  Title2.style.display = "block";
  body2c.style.display = "flex";
  body2t.style.display = "flex";
  Valid.style.display = "block";
  modalfile.style.display = "flex";
  document.querySelectorAll('.modal-figure').forEach(function (el) {
    el.style.display = 'none';
  })
};

AddPic.addEventListener("click", clickAdd)

//retour modal affichage projet//
const clickBack = () => {
  Title1.style.display = "block";
  AddPic.style.display = "block";
  DelPic.style.display = "block";
  Back.style.display = "none";
  Title2.style.display = "none";
  body2c.style.display = "none";
  body2t.style.display = "none";
  modalfile.style.display = "none";
  Valid.style.display = "none";
  document.querySelectorAll('.modal-figure').forEach(function (el) {
    el.style.display = 'block';
  })
  resetForm();
};

Back.addEventListener("click", clickBack)

DisplayPro();

//Supression d'un projet choisis //
const DeleteFigure = async (figureId) => {
  try {

    const r = await fetch(UrlAPIworks + '/' + figureId, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    if (!r.ok) {
      throw new Error("Unknow Error");
    }
    //recupere l'element actuel pour suprresion//
    const DeleteActualFigure = document.querySelector(`.modal-figure[data-figure-id="${figureId}"]`);
    if (DeleteActualFigure) {
      DeleteActualFigure.remove();
    }

    await DisplayPro();

  } catch (error) {
    console.error(error);
  }
}
//Suprresion de tt les projets//

const deleteAll = async () => {
  try {
    const works = await fetch(UrlAPIworks).then(r => r.json());
    while (works.length > 0) {
      const figureId = works[0].id;
      const r = await fetch(UrlAPIworks + '/' + figureId, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      //recupere un a un les projets et les supp//
      if (r.ok) {
        works.shift();
      }
    }
    alert("Tous a était supprimé avec succès !");
  } catch (error) {
    console.error(error);
  }
}

DelPic.addEventListener('click', deleteAll);

//changement de la couleur du bouton de validation d'ajout projet//
const Titre = document.querySelector("#titre");
const Categorie = document.querySelector("#cat");
const fileImage = document.querySelector("#modalfile");

const ChangeBGValid = (event) => {
  if (Titre.value !== "" && Categorie.value !== "" && fileImage.files[0] !== undefined) {
    Valid.style.backgroundColor = "#1D6154";
  } else {
    Valid.style.backgroundColor = "#A7A7A7";
  }
}

Titre.addEventListener("change", ChangeBGValid);
Categorie.addEventListener("change", ChangeBGValid);
fileImage.addEventListener("change", ChangeBGValid);

//Ajout d'une figure grace a l'api //
const addFigure = async (event) => {
  event.preventDefault();

  if (Titre.value === "" || Categorie.value === "" || fileImage.files[0] === undefined) {
    alert("Une ou plusieurs cases ne sont pas remplies");
  }

  try {
    //recupere les donées entrée//
    const dataform = new FormData();
    dataform.append("title", Titre.value);
    dataform.append("category", Categorie.value);
    dataform.append("image", fileImage.files[0]);

    const r = await fetch(UrlAPIworks, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: dataform,
    });

    if (r.status === 201) {
      //une fois ajouté formulaire et affichage sont reset//
      await DisplayPro();

      resetForm();

    }

  } catch (error) {
    console.error(error);
  }
}

Valid.addEventListener("click", addFigure);

//preview des photos lors de l'input//
let form = document.querySelector("#form");
let preview = document.querySelector("#preview");
let icon = modalfile.querySelector("i");
let span = modalfile.querySelector("span");
let label = modalfile.querySelector("label");

const ImagePreview = (event) => {
  var image = URL.createObjectURL(event.target.files[0]);
  var newimg = document.createElement('img');
  newimg.src = image;
  newimg.style.maxHeight = "169px";
  newimg.style.maxWidth = "83%"
  preview.appendChild(newimg);
  //hide l'arriere plan pour laissser places a l'image//
  if (preview.childNodes.length !== 0) {
    icon.style.display = "none";
    span.style.display = "none";
    label.style.display = "none";
  }
}

//reset du formulaire d'ajout projet//
const resetForm = () => {
  preview.innerHTML = '';
  form.reset();
  icon.style.display = "block";
  span.style.display = "block";
  label.style.display = "flex";
}