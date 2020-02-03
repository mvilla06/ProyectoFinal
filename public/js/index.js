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
                    console.log(responseJSON);
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


function init(){
    watchSearch();
}

init();