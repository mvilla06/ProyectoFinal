function getInfo(){
    token = localStorage.getItem('token');
    $.ajax({
        method:"GET",
        url: '/api/perfil',
        headers:{
            'Authorization': 'Bearer '+token
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
    $('#nombre').append(document.createTextNode(responseJSON.nombre))
    $('#correo').append(document.createTextNode(responseJSON.correo))

    $('#direccion').append(document.createTextNode(responseJSON.direccion.calle), document.createTextNode(' '+responseJSON.direccion.numero))

    
    
}


function watchForm(){
    $("#editar").on('click', (event)=>{
        let forma2 = document.createElement('form');

        let br = document.createElement('br')
        let nombre2 = document.createElement("input");
        $(nombre2).attr('type', 'text');
        $(nombre2).attr('id', 'nuevoNombre');
        let labelNombre = document.createElement('label');
        $(labelNombre).text('Nombre nuevo: ')
        $(labelNombre).append(nombre2);
        
        let password2 = document.createElement("input");
        $(password2).attr('type', 'password');
        $(password2).attr('id', 'nuevoPass');
        let labelPass = document.createElement('label');
        $(labelPass).text('Constraseña nueva: ')
        $(labelPass).append(password2);

        let correo2 = document.createElement("input");
        $(correo2).attr('type', 'text');
        $(correo2).attr('id', 'nuevoMail');
        let labelMail = document.createElement('label');
        $(labelMail).text('Correo nuevo: ')
        $(labelMail).append(correo2);

        let calle2 = document.createElement("input");
        $(calle2).attr('type', 'text');
        $(calle2).attr('id', 'nuevoCalle');
        let labelCalle = document.createElement('label');
        $(labelCalle).text('Calle nueva: ')
        $(labelCalle).append(calle2);

        let num2 = document.createElement("input");
        $(num2).attr('type', 'number');
        $(num2).attr('id', 'nuevoNum');
        let labelNum = document.createElement('label');
        $(labelNum).text('Número nuevo: ')
        $(labelNum).append(num2);

        let divNombre = document.createElement('div');
        $(divNombre).append(labelNombre);
        let divPass = document.createElement('div');
        $(divPass).append(labelPass);
        let divMail = document.createElement('div');
        $(divMail).append(labelMail);
        let divDir = document.createElement('div');
        $(divDir).append(labelCalle, labelNum);
        

        let button2 = document.createElement('button');
        $(button2).attr('type', 'submit');
        $(button2).text("Actualizar");
        $(forma2).append(divNombre, divMail, divPass, divDir, button2);
        $('#datos').remove()
        $(forma2).attr('class', 'perfil')
        $('#profile').append(forma2);


        
    })
}


function watchNew(){
    $('#profile').on('submit', (event)=>{
        event.preventDefault();
        let nuevoNombre = $('#nuevoNombre').val() ||undefined;
        let nuevoPass = $('#nuevoPass').val() ||undefined;
        let nuevoMail = $('#nuevoMail').val() ||undefined;
        let nuevoCalle = $('#nuevoCalle').val() ||undefined;
        let nuevoNum = $('#nuevoNum').val() ||undefined;

        if(nuevoNombre || nuevoPass || nuevoNum || nuevoMail ||nuevoCalle){
            let obj = {
                nombre:nuevoNombre,
                password: nuevoPass,
                correo: nuevoMail,
                
                    calle: nuevoCalle,
                    numero: nuevoNum
                
            }


            $.ajax({
                method:'PUT',
                contentType: 'application/json',
                data: JSON.stringify(obj),
                url: '/api/actualizar',
                headers:{
                    'Authorization': 'Bearer '+token
                },
                success:function(){
                    location.reload();
                },
                error:function(error){
                    console.log(error);
                    throw error;
                }
            })
        }else{
            console.log('Campos Vacios');
        }
        
    })
}

function init(){
    getInfo();

    watchForm();
    watchNew();
}

init();