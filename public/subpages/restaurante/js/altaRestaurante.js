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
		restaurante.correo = event.target.mail.value;
		restaurante.password = event.target.pass.value 
		let url = "/api/newRestaurant/";
		let settings = {
			method : "POST",
			body : JSON.stringify(restaurante),
			headers:{
    			'Content-Type': 'application/json'
  			}
		}
		fetch(url, settings)
			.then((response)=>{
				if(response.ok){
					return response.json();
				}

					throw new Error(response.statusText);
				});
		url = "/api/register";
		settings = {
			method : "POST",
			body : JSON.stringify({user: restaurante.correo, password: restaurante.password, tipo: "restaurante"}),
			headers:{
    			'Content-Type': 'application/json'
  			}
		}
		fetch(url, settings)
			.then((response)=>{
				if(response.ok){
					return response.json();
				}
					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					window.location.href = "./../../../index.html"
				});
	});
}

function init(){
	watchButtons();
}

let menu = [];
init();