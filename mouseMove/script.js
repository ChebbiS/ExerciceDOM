const divFirst = document.createElement('div');

const paragraphFirst = document.createElement('p');
paragraphFirst.textContent = 'Mouse position';

document.body.appendChild(divFirst);

divFirst.appendChild(paragraphFirst);

document.addEventListener('pointermove', (event) => {
    paragraphFirst.innerHTML = `X: ${event.clientX} Y: ${event.clientY}`;
    console.log(event);
})

