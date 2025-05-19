const createForm = document.createElement('form');

document.body.appendChild(createForm);

const title = document.createElement('h1');
title.textContent = 'Tâche à faire :';
createForm.appendChild(title);

const input = document.createElement('input');
createForm.appendChild(input);

const button = document.createElement('button');
button.textContent = 'Ajouter';
createForm.appendChild(button);

const list = document.createElement('ul');
createForm.appendChild(list);

const InputContent = document.querySelector('input');
const Button = document.querySelector('button');
const List = document.querySelector('ul');

Button.addEventListener('click', (event) => {
    event.preventDefault();
    const li = document.createElement('li');
    li.textContent = InputContent.value;
    List.appendChild(li);
    InputContent.value = '';
})