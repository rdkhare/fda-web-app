const resultJSON = require('./excel-convert');

let HDS = resultJSON["HDS"];


function search() {
    var input, filter, div, li, a, i, txtValue;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    div = document.getElementById("linkContainer");
    console.log(HDS.length)
    /*for (i = 0; i < HDS.length; i++) {
        a = div.getElementsByTagName("a")[i];
        console.log(a);
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }*/
}

search();