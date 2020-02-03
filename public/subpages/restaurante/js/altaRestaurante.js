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
		console.log(menu);
	});
	let table = document.getElementById('menuTable');
	table.addEventListener('click', (event)=>{
		if(event.target.tagName="Button"){
			var i = event.target.parentNode.parentNode.rowIndex;
			document.getElementById("menuTable").deleteRow(i);
			menu.splice(i-1,1);
		}
	});
}

function init(){
	watchButtons();
}

let menu = [];
init();