const form = document.querySelector('#form');
form.addEventListener('submit', (event) => {
    const firstName = document.querySelector('#firstName');
    const lastName = document.querySelector('#lastName');
    event.preventDefault();
    console.log(`Hello, ${firstName.value} ${lastName.value}`);
});
