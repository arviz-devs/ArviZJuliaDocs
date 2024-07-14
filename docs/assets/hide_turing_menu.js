// Remove the Turing navigation menu from the documentation pages,
// if present. Tested against the navbar code defined in
// https://github.com/TuringLang/turinglang.github.io/blob/3e4f5900d90e014a939867e3fe1ac256bdd37f14/assets/scripts/TuringNavbar.html
document.addEventListener("DOMContentLoaded", function () {
    var navElement = document.querySelector('nav.ext-navigation');
    if (navElement) {
        // Remove the <style> tag before the <nav> element
        var prevElement = navElement.previousElementSibling;
        if (prevElement && prevElement.tagName.toLowerCase() === 'style') {
            prevElement.parentNode.removeChild(prevElement);
        }

        // Remove the <nav> element
        navElement.parentNode.removeChild(navElement);

        // Remove the <script> tag after the <nav> element
        var nextElement = navElement.nextElementSibling;
        if (nextElement && nextElement.tagName.toLowerCase() === 'script') {
            nextElement.parentNode.removeChild(nextElement);
        }
    }
});
