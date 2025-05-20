const Listener = document.querySelector('.dropdown-btn')
Listener.addEventListener('click', (event) => {
    const changeClassList = document.querySelector('.dropdown-menu-content')
    changeClassList.classList.toggle('visible')
})
