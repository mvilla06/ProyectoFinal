
function watchSearch(){
    let buscar = $('#busqueda');
    $(buscar).on("submit", (event)=>{
        event.preventDefault();

        let busqueda = $('#busquedaTexto');
        
        if($(busqueda).val()!="" && (/([a-z]|[A-Z])/.test($(busqueda).val()))){
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
            

        }
        $(busqueda).val("");
    });
}

function watchResults(){
    let listaRestaurantes = document.getElementById("listaRestaurantes");
    listaRestaurantes.addEventListener("click", (event)=>{
        if(event.target.classList.contains("restaurante")){
            localStorage.setItem("id",event.target.children[2].innerHTML);
            window.location.href = "./subpages/restaurante/InfoRestaurante.html";
        }
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
        let idLabel=document.createElement("label");
        idLabel.className = "hidden";
        idLabel.innerHTML = element.id;
        restDiv.appendChild(idLabel);
    });
}

function checkSession(){
    $.ajax({
        method:'GET',
        headers:{
            authorization: 'Bearer '+localStorage.getItem('token')
        },
        url: 'api/session',
        success:(function(){
            $('nav').empty();
            $('nav').html('<a href="./subpages/usuario/Home.html">Inicio</a>            <a href="./index.html">Explorar</a>             <a href="./subpages/usuario/Ordenes.html">Órdenes</a>             <a href="./subpages/usuario/Perfil.html" id="perfil">&#x1F464</a>')
        }),
        error:(err=>{
            if(err.status!=400){
                throw err;
            }
        })
    })
}


function init(){
    checkSession()
    displayDB();
    watchSearch();
    watchResults();
}

init();