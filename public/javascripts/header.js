document.addEventListener('scroll', function () {
    setHeaderScroll();
});

function setHeaderScroll() {
    const header = document.getElementsByTagName('header')[0];
    const navBar = document.getElementsByClassName('navbar-brand')[0];
    if (window.scrollY > 0) {
        //.navbar-brand.menu-animation 
        navBar.classList.add('menu-animation');

        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        navBar.classList.remove('menu-animation');
    }
}

setHeaderScroll();