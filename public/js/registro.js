

function watchForm(){
    let form = $("#registro");
    $(form).on('submit', (event)=>{
        event.preventDefault();
        let user = $("#user").val();
        let password = $('#password').val();
        let nombre = $("#nombre").val();
        let calle = $('#calle').val();
        let num = $('#num').val();
        if(!(user=="" || password=="" ||nombre==""|| !num ||calle=="")){
            if ((/([a-z]|[A-Z]|[0-9])\@([a-z])*.com/).test(user)){
                $.ajax({
                    method:"POST",
                    url: "/api/register",
                    contentType:"application/json",
                    dataType:'json',
                    data:JSON.stringify({
                        user: user,
                        password: password,
                        tipo: 'usuario',
                        nombre: nombre,
                        direccion:{calle:calle, numero: num}
                    }),
                    success:function(responseJSON){
                        console.log(responseJSON);
                        window.location.href = '../login.html'
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
        $('#nombre').val('');
        $('#calle').val('');
        $('#num').val('');

    })
}


function init(){
    watchForm();
}

init();