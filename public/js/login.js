

function watchForm(){
    let form = $("#login");
    $(form).on('submit', (event)=>{
        event.preventDefault();
        let user = $("#user").val();
        let password = $('#password').val();
        if(!(user=="" || password=="")){
            if ((/([a-z]|[A-Z]|[0-9])\@([a-z])*.com/).test(user)){
                $.ajax({
                    method:"POST",
                    url: "/api/login",
                    contentType:"application/json",
                    dataType:'json',
                    data:JSON.stringify({
                        user: user,
                        password: password
                    }),
                    success:function(responseJSON){
                        localStorage.setItem('token', responseJSON.token);
                        if(responseJSON.tipo=="usuario")
                        window.location.href = './usuario/Home.html'
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