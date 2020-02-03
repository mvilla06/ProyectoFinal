

function watchForm(){
    let form = $("#registro");
    $(form).on('submit', (event)=>{
        event.preventDefault();
        let user = $("#user").val();
        let password = $('#password').val();
        if(!(user=="" || password=="")){
            if ((/([a-z]|[A-Z]|[0-9])\@([a-z])*.com/).test(user)){
                $.ajax({
                    method:"POST",
                    url: "/api/register",
                    contentType:"application/json",
                    dataType:'json',
                    data:JSON.stringify({
                        user: user,
                        password: password,
                        tipo: usuario
                    }),
                    success:function(responseJSON){
                        console.log(responseJSON);
                    },
                    error: function(error){
                        console.log( error);
                    }
                })
            }else{
                console.log("correo invalido");
            }
        }
        else{
            console.log("Campo(s) vacios")
        }
        $('#user').val('');
        $('#password').val('');
    })
}


function init(){
    watchForm();
}

init();