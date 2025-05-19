const clickToChange = document.querySelector('.img-dogs');
clickToChange.addEventListener('click', () => {
    clickToChange.src = 'https://placecats.com/409/287';
    clickToChange.alt = 'cat';
})

const titleHovered = document.querySelector('.title');
titleHovered.addEventListener('mouseover', () => {
    titleHovered.style.color = 'red';
})

const titleLeave = document.querySelector('.title');
titleLeave.addEventListener('mouseout', () => {
    titleLeave.style.color = 'black';
})
