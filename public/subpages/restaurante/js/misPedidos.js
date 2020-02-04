function getOrders(){
	let user = localStorage.getItem('user');
	let url = '/api/restauranteUser/'+user;
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
	let table = document.getElementById('orders');
	responseJSON[0].ordenes.forEach((elemento)=>{
		let row0 = document.createElement("tr");
		let col0 = document.createElement("td");
		let col1 = document.createElement("td");
		let col2 = document.createElement("td");
		let col3 = document.createElement("td");
		let col4 = document.createElement("td");
		let col5 = document.createElement("td");
		col0.innerHTML = elemento.id;
		col1.innerHTML = elemento.timestamp;
		col2.innerHTML = elemento.direccion;
		col3.innerHTML = "";
		elemento.articulos.forEach((articulo)=>{
			col3.innerHTML = col3.innerHTML + articulo.cantidad + "x " + articulo.nombre;
			col3.appendChild(document.createElement("br"));
		});
		col4.innerHTML = elemento.status;
		let readyBtn = document.createElement("button");
		readyBtn.innerHTML="Marcar como preparado";
		row0.appendChild(col0);
		row0.appendChild(col1);
		row0.appendChild(col2);
		row0.appendChild(col3);
		row0.appendChild(col4);
		col5.appendChild(readyBtn);
		row0.appendChild(col5);
		table.appendChild(row0);
	});
}

function watchFilter(){
	let table = document.getElementById('orders');
	table.addEventListener('click', (event)=>{
		if(event.target.tagName="Button"){
			var i = event.target.parentNode.parentNode.rowIndex;
			let id = document.getElementById("orders").rows[i].cells[0].innerHTML;
			let restaurante = localStorage.getItem('user');
			let update = {
				pedido: id,
				restaurante : restaurante,
				status : "Preparado"
			}
			let url = '/api/updatePedido/';
			let settings = {
				method : "PUT",
				body : JSON.stringify(update),
				headers:{
	    			'Content-Type': 'application/json'
	  			}
			}
			fetch(url, settings)
				.then((response)=>{
					if(response.ok){
						location.reload();
					}

						throw new Error(response.statusText);
					});
		}
	});
	let filterForm = document.getElementById('filterForm');
	filterForm.addEventListener('submit', (event)=>{
		event.preventDefault();
		let url = '/api/ordersByStatus/'+localStorage.getItem('user')+"/"+event.target.status.value;
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
            reDraw(responseJSON);
        });
	});
}

function reDraw(responseJSON){
	let table = document.getElementById('orders');
	let i = 1;
	while(i<table.rows.length){
		document.getElementById("orders").deleteRow(i);
	}
	if(responseJSON.length>0){
		responseJSON.forEach((elemento)=>{
			let row0 = document.createElement("tr");
			let col0 = document.createElement("td");
			let col1 = document.createElement("td");
			let col2 = document.createElement("td");
			let col3 = document.createElement("td");
			let col4 = document.createElement("td");
			let col5 = document.createElement("td");
			col0.innerHTML = elemento.id;
			col1.innerHTML = elemento.timestamp;
			col2.innerHTML = elemento.direccion;
			col3.innerHTML = "";
			elemento.articulos.forEach((articulo)=>{
				col3.innerHTML = col3.innerHTML + articulo.cantidad + "x " + articulo.nombre;
				col3.appendChild(document.createElement("br"));
			});
			col4.innerHTML = elemento.status;
			let readyBtn = document.createElement("button");
			readyBtn.innerHTML="Marcar como preparado";
			row0.appendChild(col0);
			row0.appendChild(col1);
			row0.appendChild(col2);
			row0.appendChild(col3);
			row0.appendChild(col4);
			col5.appendChild(readyBtn);
			row0.appendChild(col5);
			table.appendChild(row0);
		});
	}
}

function init(){
	getOrders();
	watchFilter();

}

init();