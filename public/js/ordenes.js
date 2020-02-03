function init(){
    let jwt = localStorage.getItem('jwt');
    $.ajax({
        method: "GET",
        url: "/api/historial",
        headers: {
            'Authorization': 'Bearer ' +jwt
        },
        dataType: 'json',
        success: function(responseJSON){
            console.log(responseJSON);
        },
        error: function(error){
            throw error;
        }
    })
}