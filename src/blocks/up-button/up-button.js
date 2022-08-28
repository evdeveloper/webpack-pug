const upButton = document.querySelector('.up-button');
window.addEventListener('scroll', e => {
    if(window.scrollY > 100) upButton.classList.add('active')
    else upButton.classList.remove('active')
});
upButton.addEventListener('click', e => {
    scroll({
        top: 0,
        behavior: "smooth"
      });
});
