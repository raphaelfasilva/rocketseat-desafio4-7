const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .menu a")
for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}