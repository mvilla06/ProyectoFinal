let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;

let Perfil = mongoose.Schema({
    correo:{
        type:String,
        required : true,
        unique: true,
    },
    password:{
        type:String,
        required: true
    },
    tipo: String //usuario, restaurante, courier
})

let Restaurante = mongoose.Schema({
    nombre:{
        type:String
    },
    descripcion:{
        type:String
    },
    id : {
    	type : String,
    	required : true,
    	unique: true
    },
    menu:[{
        producto:String, 
        descripcion:String, 
        precio: Number
    }],
    direccion:{
        type:String
    },
    telefono:Number,
    review:[{
        descripcion:String, 
        calificacion:Number
    }],
    genero:String,
    correo: String,
    ordenes:[{
        id:String,
        timestamp: Date,
        direccion:{
            type:String
        },
        articulos:[{
            nombre:String,
            cantidad: Number
        }],
        status:String
    }]
});

let Restaurantes = mongoose.model('Restaurantes', Restaurante, 'Restaurantes');

let RestaurantesLista = {
	getAll : function(){
		return Restaurantes.find()
			.then((result)=>{
				return result;
			})
			.catch((err)=>{
				throw Error(err);
			});
	},
	buscar : function(query){
		return Restaurantes.find({ nombre: { $regex: query, $options: "i" } })
			.then((result)=>{
				return result;
			})
			.catch((err)=>{
				throw Error(err);
			});
	},
	getById : function(idParam){
		return Restaurantes.find({ id: idParam})
			.then((result)=>{
				return result;
			})
			.catch((err)=>{
				throw Error(err);
			});
	},
	newRestaurant : function(restaurant){
		console.log(restaurant);
		return Restaurantes.create(restaurant)
		.then((response)=>{
			return restaurant;
		})
		.catch((err)=>{
			throw Error(err);
		})
	},
	getByUser : function(correoParam){
		return Restaurantes.find({ correo: correoParam})
			.then((result)=>{
				return result;
			})
			.catch((err)=>{
				throw Error(err);
			});
	},
	updateRestaurant : function(restaurant){
		return Restaurantes.update({correo: restaurant.correo}, restaurant)
			.then((result)=>{
				return restaurant;
			})
			.catch((err)=>{
				throw Error(err);
			});
	},
    colocarPedido : function(correoParam, pedidos){
        let restaurante = {
            ordenes : pedidos 
        }
        return Restaurantes.update({correo: correoParam}, restaurante)
            .then((result)=>{
                return restaurante;
            })
            .catch((err)=>{
                throw Error(err);
            });
    },
    obtenerPedidos : function(correoParam){
        return Restaurantes.find({correo: correoParam})
            .then((result)=>{
                return result;
            })
            .catch((err)=>{
                throw Error(err);
            });
    }
}

let Usuario = mongoose.Schema({
    nombre: String,
    pedidos:[{
        articulos:[String], 
        restaurante:String, 
        total:Number, 
        repartidor:String, 
        status:String, 
        confirmacion:String
    }],
    direccion:{
        calle:String, 
        numero:Number
    },
    carrito:{
        articulos:[{
            nombre:String,
            cantidad: Number,
            precio: Number
        }]
    },
    correo:String
});

let Usuarios = mongoose.model('Usuarios', Usuario, 'Usuarios');

let UsuariosLista = {
    
    ordenar:function(user,obj){
        return Usuarios.findOneAndUpdate({correo:user}, {$push:{pedidos:obj}}, {new: true}).then(nuevo=>{
            return nuevo;
        })
        .catch(error=>{
            throw error;
        })
    },
    historial:function(correo){
        return Usuarios.find({correo:correo})
            .then(usuario=>{
                
                return usuario
            })
            .catch(error=>{
                throw error;
            })
    },
    comentar:function(){

    }, 
    perfil:function(correo){
        return Usuarios.find({correo:correo})
            .then(usuario=>{
                return usuario;
            })
            .catch(error=>{
                throw error;
            })
    },
    confirmar:function(){
        
    },
    actualizar:function(correo, obj){
        return Usuarios.findOneAndUpdate({correo:correo}, {correo:obj.correo, nombre:obj.nombre,direccion:obj.direccion },{omitUndefined:true, new:true})
        .then(nuevo=>{return nuevo})
        .catch(error=>{throw error})
    },
    nuevo:function(obj){
        return Usuarios.create({
            nombre:obj.nombre,
            direccion: obj.direccion,
            correo:obj.correo,
            carrito:{},
            pedidos:[]
        }).then(nuevo=>{
            return nuevo;
        })
        .catch(err=>{
            throw error;
        })
    }
}

let Perfiles = mongoose.model('Perfiles', Perfil, 'Perfiles');

let PerfilesLista = {
    buscarCorreo:function(correo){
        return Perfiles.find({correo:correo})
        .then(result=>{
            if(result){
                return result;
            }
        })
        .catch(error=>{
            throw error;
        }  
        )
    },
    registrar:function(obj){
        return Perfiles.create({correo:obj.user, password:obj.password, tipo: obj.tipo}).then(nuevo=>{
            return nuevo;
        })
        .catch(error=>{
            throw error;
        })
    },
    actualizar:function(correo, obj){
        return Perfiles.findOneAndUpdate({correo:correo}, {correo:obj.correo, password: obj.password}, {omitUndefined:true, new:true}).then(
            nuevo=>{return nuevo}
        ).catch(
            error=>{throw error}
        )
    }
}

module.exports = {
    RestaurantesLista,
    UsuariosLista,
    PerfilesLista
};