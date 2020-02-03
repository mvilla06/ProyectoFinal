function init(){
    token = localStorage.getItem('token');
    $.ajax({
        method:"GET",
        url: '/api/historial',
        headers:{
            'Authorization': 'Bearer '+token
        }, 
        dataType: 'json',
        success: function(responseJSON){
            console.log(responseJSON);

        },
        error: function(error){
            /*if(error.status!=500)
            window.location.href = "../login.html"*/
        }
    })
}

init();