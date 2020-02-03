
function displayResults(responseJSON){
    let sectionRestaurantes = document.getElementById("listaRestaurantes");
    sectionRestaurantes.innerHTML = ""; 
    responseJSON.forEach((element)=>{
        let restDiv=document.createElement("div");
        restDiv.className = "restaurante";
        restDiv.innerHTML = element.nombre;
        sectionRestaurantes.appendChild(restDiv);
        let descDiv=document.createElement("div");
        descDiv.className = "descripcion";
        descDiv.innerHTML = element.descripcion;
        let reviewDiv=document.createElement("div");
        reviewDiv.className = "review";
        let suma = 0;
        element.review.forEach((calif)=>{
            suma = suma + calif.calificacion;
        });
        let avg = suma/element.review.length;
        reviewDiv.innerHTML = avg;
        restDiv.appendChild(descDiv);
        restDiv.appendChild(reviewDiv);


    });
}

function watchSearch(){
    let buscar = $('#busqueda');
    $(buscar).on("submit", (event)=>{
        event.preventDefault();

        let busqueda = $('#busquedaTexto');
        
        if($(busqueda).val()!="" && (/([a-z]|[A-Z]|[0-9])/.test($(busqueda).val()))){
            let url = '/api/buscarRestaurante/'+$(busqueda).val().replace(/\s+/g, "+");
            $.ajax({
                method: "GET", 
                url: url,
                dataType: "json",
                success: function(responseJSON){
                    displayResults(responseJSON);
                },
                error: function(error){
                    throw error;
                }
            })
            console.log(url);

        }
        $(busqueda).val("");
    });
}

function displayDB(){
    let url = '/api/allRestaurants';
    let settings = {
        method : "GET"
    }
    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(responseJSON => {
            displayResults(responseJSON);
        });
}

function init(){
    displayDB();
    watchSearch();
}

init();