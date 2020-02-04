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
	let col4 = document.createElement('th');
	let col5 = document.createElement('th');
	col1.innerHTML = "Producto";
	row.appendChild(col1);
	col2.innerHTML = "Descripción";
	row.appendChild(col2);
	col3.innerHTML = "Precio";
	row.appendChild(col3);
	col4.innerHTML = "Cantidad";
	row.appendChild(col4);
	col5.innerHTML = "Subtotal";
	row.appendChild(col5);
	menu.appendChild(row);
	responseJSON[0].menu.forEach((element)=>{
		let row = document.createElement('tr');
		let col1 = document.createElement('td');
		let col2 = document.createElement('td');
		let col3 = document.createElement('td');
		let col4 = document.createElement('td');
		let col5 = document.createElement('td');
		col1.innerHTML = element.producto;
		row.appendChild(col1);
		col2.innerHTML = element.descripcion;
		row.appendChild(col2);
		col3.innerHTML = "$"+element.precio;
		row.appendChild(col3);
		let Qinput = document.createElement('input');
		Qinput.type = "Number";
		Qinput.value = 0;
		col5.innerHTML = "$"+Qinput.value*parseFloat(element.precio);
		col4.appendChild(Qinput);
		row.appendChild(col4);
		row.appendChild(col5);
		menu.appendChild(row);
	});
	row = document.createElement('tr');
	col1 = document.createElement('th');
	col2 = document.createElement('th');
	col3 = document.createElement('th');
	col4 = document.createElement('th');
	col5 = document.createElement('th');
	col1.innerHTML = " ";
	row.appendChild(col1);
	col2.innerHTML = " ";
	row.appendChild(col2);
	col3.innerHTML = " ";
	row.appendChild(col3);
	col4.innerHTML = "Total";
	row.appendChild(col4);
	let total = 0;
	let filas = document.getElementById("menu").rows;
	let i=1;
	while(i<filas.length){
		total = total + parseFloat(filas[i].cells[4].innerHTML.replace("$",""));
		i++;
	}
	col5.innerHTML = "$"+total;
	row.appendChild(col5);
	menu.appendChild(row);
}

function watchInputs(){
	let menu = document.getElementById('menu');
	menu.addEventListener("change", (event)=>{
		var i = event.target.parentNode.parentNode.rowIndex;
		columns = document.getElementById("menu").rows[i].cells;
		columns[4].innerHTML = "$"+columns[3].children[0].value*parseFloat(columns[2].innerHTML.replace("$",""));
		let total = 0;
		let filas = document.getElementById("menu").rows;
		i=1;
		while(i<filas.length-1){
		console.log(filas[i].cells[4])
		total = total + parseFloat(filas[i].cells[4].innerHTML.replace("$",""));
		i++;
	}
	filas[filas.length-1].cells[4].innerHTML = "$"+total;

	});
	let botonOrdenar = document.getElementById('ordenar');
	botonOrdenar.addEventListener('click', (event)=>{
		event.preventDefault();
		localStorage.setItem('pedido', document.getElementById("menu"));

	});
}

function init(){
	fetchInformation();
	watchInputs();
}

init();