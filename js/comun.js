document.getElementById("handle").onclick = function () {
    const descripcion = document.getElementById("descripcion");
    const shadow = document.getElementById("sketch-shadow");

    if (descripcion.style.display == "none") {
        descripcion.style.display = "block";
        shadow.style.display = "block";
    } else {
        descripcion.style.display = "none";
        shadow.style.display = "none";
    }
}
