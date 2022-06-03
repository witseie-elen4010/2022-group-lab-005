
const darkMode = sessionStorage.getItem("mode");

//  set current current scheme 
if (darkMode === 'true') {
    document.body.classList.toggle("dark-mode")
} else {
    document.body.classList.toggle("light-mode")
}