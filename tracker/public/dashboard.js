function get_nextSibling(n) {
    y=n.nextSibling;
    while (y.nodeType!=1) {
        y=y.nextSibling;
    }
    return y;
}

function toggleFold() {
    toggleList = get_nextSibling(this)
    if(toggleList.style.display == 'block') {
        toggleList.style.display = 'none';
    }
    else {
        toggleList.style.display = 'block';
    }
}


var elems = document.getElementsByTagName('span'), i;
for (i in elems) {
    if(elems[i].className == 'foldToggle') {
        elems[i].addEventListener("click", toggleFold, false);
    }
}

