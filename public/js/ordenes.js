function getOrders(){
    let jwt = localStorage.getItem('token');
    
    $.ajax({
        method: "GET",
        url: "/api/historial",
        headers: {
            'Authorization': 'Bearer ' +jwt
        },
        dataType: 'json',
        success: function(responseJSON){
            console.log(responseJSON);
            displayResults(responseJSON);
        },
        error: function(error){
            if(error.status==400)
            window.location.href = "../login.html"
        }
    })
}

function displayResults(responseJSON){
    $('main').empty();
    if(responseJSON[0].pedidos.length>0){
    responseJSON[0].pedidos.forEach(function
        (current){
            if (current.status=="Entregado"){
                let pedido = document.createElement('div');
                $(pedido).attr('class', 'pedido');
                let descripcion = document.createElement('div');
                $(descripcion).attr('class', 'descripcion');

                let producto = document.createElement('ul');
                $(producto).attr('class', 'producto');
                current.articulos.forEach(function(articulo){
                    let art = document.createElement('li');
                    $(art).text('\u2022'+articulo);
                    $(producto).append(art);
                });
                
                let rest = document.createElement('div');
                $(rest).attr('class', 'restOrigen');
                $(rest).text(current.restaurante);

                let courier = document.createElement('div');
                $(courier).attr('class', 'courier');
                $(courier).text('Repartidor: '+current.repartidor);
                
                $(descripcion).append(producto, rest, courier);

                let precio = document.createElement('div');
                $(precio).attr('class', 'precio');
                let span = document.createElement('span');
                $(span).text('Total: ');
                $(precio).text('$'+current.total);
                $(precio).prepend(span);

                let sts = document.createElement('div');
                $(sts).attr('class', 'status');
                let statusMsg = document.createElement('span');
                $(statusMsg).text(current.status);
                $(statusMsg).attr('id', 'mensaje');
                
                $(sts).append(statusMsg);

                $(pedido).append(descripcion, precio, sts);
                $('main').append(pedido);
            }
        }
    )
    }
}



function init(){
    getOrders();
    
}

init();