// Fonctions pour injecter nos éléments dans le DOM (après avoir récupéré nos éléments depuis une base de données)
function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function createUser(user) {
    let li = createNode('li');
    let span = createNode('span');

    let btnPatch = createNode('button');
    let btnDelete = createNode('button');

    // Identifiants pour retrouver plus tard les éléments
    li.id = `li-${user.id}`;
    span.id = `row-${user.id}`;

    // Contenu utilisateur dans le span
    span.innerHTML = `Nom : ${user.name} - Email : ${user.email} Sexe : ${user.gender} - Id : ${user.id}`;

    // Configuration des boutons
    btnPatch.classList.add("btn-edit");
    btnPatch.dataset.userId = user.id;  // <-- Important, on stocke l'id dans data-user-id
    btnPatch.innerText = "Éditer";
    btnPatch.addEventListener("click", (event) => {
        event.stopPropagation();
        postOrEditUserForm(event);
    });

    btnDelete.classList.add("btn-delete");
    btnDelete.dataset.userId = user.id;  // <-- Même chose pour supprimer
    btnDelete.innerText = "Supprimer";
    btnDelete.addEventListener("click", (event) => {
        event.stopPropagation();
        deletetDatas(event);
    });

    // Insertion propre dans le DOM
    append(li, span);
    append(li, btnPatch);   // ← Boutons dans le <li>, pas dans le <span>
    append(li, btnDelete);
    append(ul, li);
}


// Généralités
const ul = document.getElementById('users');
const baseUrl = 'https://gorest.co.in';
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
let userListFetched = [];
let userToEdit = {};
let token = "Bearer 88d646fc526fd2ed575953f54317340815a44288044d46a2ad1aeeb1855b0fd8";


/**
 * REQUÊTE GET
 */

const getDatasBtn = document.querySelector("#get-datas");

const getDatas = () => {
    // Vider la liste avant de remplir (pour éviter doublons)
    ul.innerHTML = "";

    // Appeler l'API
    fetch(`${baseUrl}/public/v2/users`)
        .then((resp) => resp.json())
        .then((data) => {
            userListFetched = data;
            data.forEach((user) => {
                createUser(user);
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

getDatasBtn.addEventListener("click", getDatas);


/**
 * REQUÊTE POST & PATCH
 */

let postOrPatchMethod = "";

const postDatasBtn = document.querySelector("#post-datas");

const postOrEditUserForm = (event) => {
    const userId = Number(event.target.dataset.userId);

    if (!userId) {
        // Ajout (POST)
        postOrPatchMethod = "POST";
        // Clear formulaire
        userName.value = "";
        userEmail.value = "";
        userGender.value = "male";  // valeur par défaut
        userStatus.value = "active"; // valeur par défaut
        userToEdit = {};
    } else {
        // Edition (PATCH)
        userToEdit = userListFetched.find(user => user.id === userId);
        if (!userToEdit) {
            console.error("Utilisateur non trouvé pour édition !");
            return;
        }
        userName.value = userToEdit.name;
        userEmail.value = userToEdit.email;
        userGender.value = userToEdit.gender;
        userStatus.value = userToEdit.status;
        postOrPatchMethod = "PATCH";
    }

    modal.style.display = "block";
}

postDatasBtn.addEventListener("click", postOrEditUserForm);

/**
 * Formulaire d'ajout/édition
 */

const editForm = document.querySelector("#edit-user-form");
const userName = document.querySelector("#username");
const userEmail = document.querySelector("#user-email");
const userGender = document.querySelector("#user-gender");
const userStatus = document.querySelector("#status");


editForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let userEdited = {
        name: userName.value,
        email: userEmail.value,
        gender: userGender.value,
        status: userStatus.value,
    };

    const postOrPatchParameters = {
        method: postOrPatchMethod,
        headers: {
            "Content-Type":  "application/json",
            "Authorization": token
        },
        body: JSON.stringify(userEdited)
    };

    const baseUrlPostOrEdit = `${baseUrl}/public/v2/users`;

    let fetchUrl = "";

    if(postOrPatchMethod === "PATCH") {
        fetchUrl = `${baseUrlPostOrEdit}/${userToEdit.id}`;
    } else {
        fetchUrl = `${baseUrlPostOrEdit}`;
    }

    fetch(fetchUrl, postOrPatchParameters)
        .then((resp) => resp.json())
        .then((userCreatedOrUpdated) => {
            if(postOrPatchMethod === "PATCH") {
                // Met à jour la ligne existante
                let userToReplace = userListFetched.find(user => user.id === Number(userCreatedOrUpdated.id));
                if (userToReplace) {
                    userToReplace.name = userCreatedOrUpdated.name;
                    userToReplace.email = userCreatedOrUpdated.email;
                    userToReplace.gender = userCreatedOrUpdated.gender;
                    userToReplace.status = userCreatedOrUpdated.status;

                    const row = document.querySelector(`#row-${userToReplace.id}`);
                    if(row) {
                        row.innerHTML = `Nom : ${userCreatedOrUpdated.name} - Email : ${userCreatedOrUpdated.email} Sexe : ${userCreatedOrUpdated.gender} - Id : ${userCreatedOrUpdated.id}`;
                    }
                }
            } else {
                // Ajoute nouvel utilisateur
                userListFetched.push(userCreatedOrUpdated);
                createUser(userCreatedOrUpdated);
            }
            modal.style.display = "none";
        })
        .catch(err => {
            console.log(err);
        });
});

/**
 * REQUÊTE DELETE
 */

const deletetDatas = (event) => {
    const userId = Number(event.target.dataset.userId);
    const userToDelete = userListFetched.find(user => user.id === userId);

    if (!userToDelete) {
        console.error("Utilisateur non trouvé pour suppression !");
        return;
    }

    const deleteParameters = {
        method: 'DELETE',
        headers: {
            "Content-Type":  "application/json",
            "Authorization": token
        }
    };

    fetch(`${baseUrl}/public/v2/users/${userToDelete.id}`, deleteParameters)
        .then((response) => {
            if(response.ok) {
                userListFetched = userListFetched.filter(user => user.id !== userToDelete.id);
                const row = document.querySelector(`#li-${userToDelete.id}`);
                if(row) {
                    ul.removeChild(row);
                }
            } else {
                console.error("Erreur lors de la suppression:", response.status);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

/**
 * MODAL
 */

const hideModal = () => {
    modal.style.display = "none";
}

const hideModalFromWindow = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

span.addEventListener("click", hideModal);
// Fermer le modal si clic en dehors
window.addEventListener("click", hideModalFromWindow);
