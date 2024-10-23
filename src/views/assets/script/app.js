const shrink_btn = document.querySelector(".shrink-btn");
const sidebar_links = document.querySelectorAll("a.nt__nav__link:not(.nt__nav__link_dd),a.nt__nav__dropdown-item");
const theme_selector = document.getElementById("theme-selector");
const ntNavBar = document.getElementById("ntNavBar")

const themes = {
    "light": { "name": "theme_light", "icon": "nt-logos_black.png", "selectorIcon": "bx bxs-sun" },
    "dark": { "name": "theme_dark", "icon": "nt-logos_white.png", "selectorIcon": "bx bxs-moon" }
};
const DEFAULT_THEME = "dark";

const applayTheme = (themeName, init = false) => {
    console.log("Active theme: " + themeName);
    const theme = themes[themeName];
    const iconLink = document.getElementById("ntIcon");
    iconLink.setAttribute("src", `assets/images/${theme.icon}`);
    localStorage.setItem("nt_active_theme", themeName);
    const classToToggle = (init && themeName == DEFAULT_THEME) ? '' : 'dark-layout'
    theme_selector.classList.toggle(classToToggle);
    document.body.classList.toggle('dark-layout');
    document.querySelector("#theme-selector i").className = theme.selectorIcon;

}
const initTheme = () => {
    const activeThemeT = localStorage.getItem("nt_active_theme") || DEFAULT_THEME;
    if (activeThemeT != DEFAULT_THEME) {
        applayTheme(activeThemeT, true);
    }
}

initTheme();

theme_selector.addEventListener("click", (e) => {
    e.preventDefault()
    const themeName = theme_selector.classList.contains("dark-layout") ? 'light' : 'dark'
    applayTheme(themeName)
});


shrink_btn.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("shrink");
});


function changeLink() {
    const sidebar_sub_link_active = ntNavBar.querySelectorAll("a.active")
    sidebar_sub_link_active.forEach(activeLink => activeLink.classList.remove("active"))

    this.classList.add("active")

    if (this.classList.contains("nt__nav__dropdown-item")) {
        const parentElement = this.closest(".nt__nav__dropdown")
        parentDD = parentElement ? parentElement.querySelector('.nt__nav__link') : null
        if (parentDD) {
            parentDD.classList.add("active")
        }
        this.classList.add("active")
    }
}

sidebar_links.forEach((link) => link.addEventListener("click", changeLink));

const showMenu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
        nav = document.getElementById(navbarId)

    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('nt-mobile-show-nav-mobile');
        })
    }
}
showMenu('nt-header-toggle', 'ntNavBar');

$(".nt__nav__dropdown > a").click(function (e) {
    e.preventDefault();
    $(".nt__nav__dropdown-collapse").slideUp(350);

    if (
        $(this)
            .parent()
            .hasClass("nav__dropdown-active")
    ) {
        $(".nt__nav__dropdown").removeClass("nav__dropdown-active");
        $(this)
            .parent()
            .removeClass("active");
    } else {
        $(".nt__nav__dropdown").removeClass("nav__dropdown-active");
        $(this)
            .next(".nt__nav__dropdown-collapse")
            .slideDown(350);
        $(this)
            .parent()
            .addClass("nav__dropdown-active");
    }
});

// botão para encerrar a sessão
document.getElementById('logout').addEventListener('click', function (event) {
    event.preventDefault();
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = '/';
    console.log("Clicou aqui no logout")
});



function clearCookies(event) {
    // Evita que o link padrão execute
    event.preventDefault();

    // Função para remover todos os cookies
    function deleteAllCookies() {
        const cookies = document.cookie.split(";"); // Divide os cookies em um array
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf("="); // Encontra a posição do '='
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie; // Obtém o nome do cookie
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Define a data de expiração para o passado
        }
    }

    // Chama a função para deletar os cookies
    deleteAllCookies();

    // Redireciona para a página inicial
    window.location.href = "/";
}
