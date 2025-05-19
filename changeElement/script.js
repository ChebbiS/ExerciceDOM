const newCatImage = document.createElement('img');
newCatImage.src = "https://placecats.com/408/287";
newCatImage.alt = "chat trop mignon";

document
    .querySelector('.second-card')
    .appendChild(newCatImage);
