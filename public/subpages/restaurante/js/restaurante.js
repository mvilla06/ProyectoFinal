function fetchInformation(){
	let id = localStorage.getItem('id');
	let url = '/api/restauranteId/'+id;
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
            displayInformation(responseJSON);
        });
}

function displayInformation(responseJSON){
	document.getElementById('title').innerHTML = responseJSON[0].nombre;
	document.getElementById('header').innerHTML = responseJSON[0].nombre;
	document.getElementById('desc').innerHTML = responseJSON[0].descripcion;
	document.getElementById('dir').innerHTML = responseJSON[0].direccion;
	document.getElementById('tel').innerHTML = responseJSON[0].telefono;
	document.getElementById('email').innerHTML = responseJSON[0].correo;
	let suma = 0;
    responseJSON[0].review.forEach((calif)=>{
        suma = suma + calif.calificacion;
    });
    let avg = suma/responseJSON[0].review.length;
	document.getElementById('rev').innerHTML = avg;
	let menu = document.getElementById('menu');
	menu.innerHTML = "";
	let row = document.createElement('tr');
	let col1 = document.createElement('th');
	let col2 = document.createElement('th');
	let col3 = document.createElement('th');
	col1.innerHTML = "Producto";
	row.appendChild(col1);
	col2.innerHTML = "Descripción";
	row.appendChild(col2);
	col3.innerHTML = "Precio";
	row.appendChild(col3);
	menu.appendChild(row);
	responseJSON[0].menu.forEach((element)=>{
		let row = document.createElement('tr');
		let col1 = document.createElement('td');
		let col2 = document.createElement('td');
		let col3 = document.createElement('td');
		col1.innerHTML = element.producto;
		row.appendChild(col1);
		col2.innerHTML = element.descripcion;
		row.appendChild(col2);
		col3.innerHTML = element.precio;
		row.appendChild(col3);
		menu.appendChild(row);
	});
	let reviewsDiv = document.getElementById('reviews');
	reviewsDiv.innerHTML = "";
	responseJSON[0].review.forEach((element)=>{
		let commentDiv = document.createElement('div');
		let bold = document.createElement('b');
		bold.innerHTML = "("+element.calificacion+") ";
		commentDiv.appendChild(bold);
		let span = document.createElement('span');
		span.innerHTML = element.descripcion;
		commentDiv.appendChild(span);
		reviewsDiv.appendChild(commentDiv);
	});
}

function init(){
	fetchInformation();
}

init();