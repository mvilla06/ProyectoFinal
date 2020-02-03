function getRestaurantInfo(){
	let url = '/api/restauranteUser/'+localStorage.getItem('user');
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
            loadResults(responseJSON);
        });
}

function loadResults(responseJSON){
	let newRestauranteForm = document.getElementById('newRestaurant');
	newRestauranteForm.nombre.value = responseJSON[0].nombre;
	newRestauranteForm.desc.value = responseJSON[0].descripcion;
	menu = responseJSON[0].menu;
	newRestauranteForm.dir.value = responseJSON[0].direccion;
	newRestauranteForm.tel.value = responseJSON[0].telefono;
	newRestauranteForm.gen.value = responseJSON[0].genero;
	let table = document.getElementById('menuTable');
	menu.forEach((element)=>{
		let row = document.createElement('tr');
		let col1 = document.createElement('td');
		let col2 = document.createElement('td');
		let col3 = document.createElement('td');
		let col4 = document.createElement('td');
		let delBtn = document.createElement('button');
		col1.innerHTML = element.producto;
		row.appendChild(col1);
		col2.innerHTML = element.descripcion;
		row.appendChild(col2);
		col3.innerHTML = element.precio;
		row.appendChild(col3);
		delBtn.innerHTML = "Eliminar";
		col4.appendChild(delBtn);
		row.appendChild(col4);
		table.appendChild(row);
	});
}

function watchButtons(){
	let menuAdd = document.getElementById('submitMenu');
	menuAdd.addEventListener('click', (event)=>{
		event.preventDefault();
		let table = document.getElementById('menuTable');
		let row = document.createElement('tr');
		let col1 = document.createElement('td');
		let col2 = document.createElement('td');
		let col3 = document.createElement('td');
		let col4 = document.createElement('td');
		let delBtn = document.createElement('button');
		col1.innerHTML = document.getElementById("platillo").value;
		row.appendChild(col1);
		col2.innerHTML = document.getElementById("descPlat").value;
		row.appendChild(col2);
		col3.innerHTML = document.getElementById("precio").value;
		row.appendChild(col3);
		delBtn.innerHTML = "Eliminar";
		col4.appendChild(delBtn);
		row.appendChild(col4);
		table.appendChild(row);
		menu.push({producto:document.getElementById("platillo").value,descripcion:document.getElementById("descPlat").value,precio:document.getElementById("precio").value});
	});
	let table = document.getElementById('menuTable');
	table.addEventListener('click', (event)=>{
		if(event.target.tagName="Button"){
			var i = event.target.parentNode.parentNode.rowIndex;
			document.getElementById("menuTable").deleteRow(i);
			menu.splice(i-1,1);
		}
	});
	let newRestauranteForm = document.getElementById('newRestaurant');
	newRestauranteForm.addEventListener('submit', (event)=>{
		event.preventDefault();
		restaurante = {};
		restaurante.nombre = event.target.nombre.value;
		restaurante.descripcion = event.target.desc.value;
		restaurante.menu = menu;
		restaurante.direccion = event.target.dir.value;
		restaurante.telefono = event.target.tel.value;
		restaurante.genero = event.target.gen.value;
		restaurante.correo = localStorage.getItem('user');
		let url = '/api/updateRestaurant/';
		let settings = {
			method : "PUT",
			body : JSON.stringify(restaurante),
			headers:{
    			'Content-Type': 'application/json'
  			}
		}
		fetch(url, settings)
			.then((response)=>{
				if(response.ok){
					window.location.href = "./../../../index.html";
				}

					throw new Error(response.statusText);
				});
	});
}

function init(){
	getRestaurantInfo();
	watchButtons();
}

let menu = [];
init();