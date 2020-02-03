let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

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
        calle:String, 
        numero:Number
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
            calle:String,
            numero:Number
        },
        status:String
    }]
});

let Restaurantes = mongoose.model('restaurantes', Restaurante);

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
		console.log(idParam);
		return Restaurantes.find({ id: idParam})
			.then((result)=>{
				console.log(result);
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

let Usuarios = mongoose.model('usuarios', Usuario);

let funcionesUsuario = {
    buscar:function(){

    },
    ordenar:function(){

    },
    historial:function(){

    },
    comentar:function(){

    }, 
    editar:function(){

    },
    confirmar:function(){
        
    }
}

module.exports = {
	RestaurantesLista
};