let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let uuid = require('uuid');
let {DATABASE_URL, PORT} = require("./config");
let {RestaurantesLista, UsuariosLista, PerfilesLista} = require("./model");
let bcrypt = require('bcrypt');
let jsonParser = bodyParser.json();

let app = express();

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    if(req.method==="OPTIONS"){
        return res.send(204);
    }
    next();
});

app.use(express.static('public'));
app.use(morgan('dev'));


app.get('/api/buscarRestaurante/:text', (req, res)=>{
    let searchQuery = req.params.text;
    searchQuery = searchQuery.replace(/\+/g, ' ');
    RestaurantesLista.buscar(searchQuery)
        .then((result)=>{
            return res.status(200).json(result);
        })
        .catch((err)=>{

            throw Error(err);
        });
});

app.get('/api/restauranteId/:id', (req, res)=>{
    let searchId = req.params.id;
    RestaurantesLista.getById(searchId)
        .then((result)=>{
            return res.status(200).json(result);
        })
        .catch((err)=>{
            throw Error(err);
        });
});

app.get('/api/restauranteUser/:user', (req, res)=>{
    let user = req.params.user;
    RestaurantesLista.getByUser(user)
        .then((result)=>{
            return res.status(200).json(result);
        })
        .catch((err)=>{
            throw Error(err);
        });
});

app.get('/api/ordersByStatus/:user/:status', (req, res)=>{
    let user = req.params.user;
    let status = req.params.status;
    if(user=="--"){
        RestaurantesLista.getAll()
            .then((result)=>{
                result.forEach((element)=>{
                    result = element.ordenes.filter((elemento)=>{
                        if(elemento.status==status){
                            return elemento;

                        }
                    });
                });
                console.log(result);
                return res.status(200).json(result);
            })
            .catch((err)=>{
                throw Error(err);
            });
    } else {
        RestaurantesLista.getByUser(user)
            .then((result)=>{
                result = result[0].ordenes.filter((elemento)=>{
                if(status=="all"){
                    return elemento;
                } else {
                    if(elemento.status==status){
                        return elemento;
                    }
                }
                });
                return res.status(200).json(result);
            })
            .catch((err)=>{
                throw Error(err);
            });
    }
});

app.get('/api/allRestaurants', (req, res)=>{
    
    RestaurantesLista.getAll()
        .then((result)=>{
            return res.status(200).json(result);
        })
        .catch((err)=>{
            return res.status(500).send();
        });
});

app.get('/api/historial', (req, res)=>{
    let token = req.headers.authorization;
    
    token = token.replace('Bearer ', '');

    jwt.verify(token, 'secret', (err, user)=>{
        if(err){
            
            res.statusMessage = 'Token invalido';
            return res.status(400).send();
        }
        
        UsuariosLista.historial(user.user)
            .then(historial=>{
                return res.status(200).json(historial);
            })
            .catch(error=>{
                console.log(error);
                return res.status(500).send();
            })
    })
})

app.get('/api/perfil', (req, res)=>{
    let token = req.headers.authorization;
    token = token.replace('Bearer ', '');

    jwt.verify(token, 'secret', (err, user)=>{
        if(err){
            
            res.statusMessage = 'Token invalido';
            return res.status(400).send();
        }
        
        UsuariosLista.perfil(user.user)
            .then(usuario=>{
                usuario = usuario[0];
                let perfil={
                    nombre:usuario.nombre,
                    direccion:usuario.direccion,
                    correo:usuario.correo
                }
                return res.status(200).json(perfil);
            })
            .catch(error=>{
                console.log(error);
                return res.status(500).send();
            })
    })
})

app.put('/api/actualizar', jsonParser,  (req, res) => {


    let token = req.headers.authorization;
    token = token.replace('Bearer ', '');

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {

            res.statusMessage = 'Token invalido';
            return res.status(400).send();
        } 

        if (req.body.calle && req.body.numero) {
            var dir = {
                calle: req.body.calle,
                numero: req.body.numero
            }
        }
        let obj = {
            nombre: req.body.nombre,
            direccion: dir,
            correo: req.body.correo,

        }

        UsuariosLista.actualizar(user.user, obj)
            .then(async nuevo => {
                if (req.body.correo || req.body.password) {


                    var pw;
                    if (req.body.password) {

                        pw = await bcrypt.hash(req.body.password, 10);
                    }
                    PerfilesLista.actualizar(user.user, { correo: req.body.correo, password: pw })
                        .then(actualizado => {




                        })
                        .catch(error => {
                            console.log(error);
                            return res.status(500).send();
                        })


                }
                return res.status(200).json({});
            })
            .catch(error => {
                console.log(error);
                return res.status(500).send();
            })





    })
})

app.post('/api/register', jsonParser, (req, res)=>{
    let user = req.body.user;
    let password = req.body.password;
    let nombre = req.body.nombre;
    let direccion = req.body.direccion;
    let tipo = req.body.tipo;
    bcrypt.hash(password, 10, (err, hash)=>{
        PerfilesLista.buscarCorreo(user)
            .then(resultado=>{
                if(resultado.length==0){
                    let obj = {
                        user:user,
                        password: hash,
                        tipo: tipo
                    }
                    PerfilesLista.registrar(obj)
                        .then(result=>{
                            console.log(result);
                            return res.status(200).json(result);
                        });
                    obj = {
                        nombre: nombre,
                        direccion: direccion,
                        correo: user
                    }
                    UsuariosLista.nuevo(obj);
                }else{
                    return res.status(406).send();
                }
            })
    })
})

app.get('/api/session', (req,res)=>{
    let token = req.headers.authorization;
    token = token.replace('Bearer ', '');

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {

            res.statusMessage = 'Token invalido';
            return res.status(400).send();
        } 
        else 
        return res.status(200).send();
    })
})

app.post('/api/login', jsonParser, (req, res)=>{
    console.log('hola')
    let user = req.body.user;
    let password=req.body.password;
    

    PerfilesLista.buscarCorreo(user)
        .then(resultado=>{
            if(resultado.length>0){
                console.log(resultado);
                bcrypt.compare(password,resultado[0].password, function(error, response){
                    console.log(response)
                    if(response){
                        let data = {
                            user
                        };
                        let token = jwt.sign(data, 'secret', {
                            expiresIn: 60 * 10
                        });

                        return res.status(200).json({ token, tipo:resultado[0].tipo });
                    }else{
                        return res.status(409).send();
                    }
                })
                
                
            }else{
                return res.status(404).send();
            }
        })
        .catch(error=>{
            console.log(error);
            return res.status(500).send();
        });
});

app.post('/api/newRestaurant/', jsonParser, (req, res) =>{
    let restaurante = req.body;
    restaurante.id = uuid.v4();
    restaurante.review = [];
    restaurante.ordenes=[];
    RestaurantesLista.newRestaurant(restaurante)
    .then((response)=>{
        return res.status(201).json(restaurante);
    })
    .catch((err)=>{
        throw Error(err);
    });
});

app.post('/api/newOrder/', jsonParser, (req, res) => {
    console.log(req.body)
    let token = req.headers.authorization;


    token = token.replace('Bearer ', '');

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {

            res.statusMessage = 'Token invalido';
            return res.status(400).send();
        }

        let correoRestaurante = req.body.restaurante;
        RestaurantesLista.obtenerPedidos(correoRestaurante)
            .then(async (response) => {
                let direccion;
                await UsuariosLista.perfil(user.user).then(perfil=>{
                    console.log(perfil);
                     direccion = perfil[0].direccion.calle+' '+perfil[0].direccion.numero;
                    
                })
                .catch(err=>{
                    throw Error(err);
                });
                console.log(direccion);
                let id = uuid.v4();
                let timestamp = new Date();
                let articulos = req.body.articulos;
                let status = "Ordenado";
                let pedido = {
                    id,
                    timestamp,
                    direccion,
                    articulos,
                    status
                }
                response[0].ordenes.push(pedido);
                RestaurantesLista.colocarPedido (correoRestaurante, response[0].ordenes)
                    .then( (response) => {
                        console.log(response);
                        let articulos = [];
                        for (let i=0; i<req.body.articulos.length;i++){
                            articulos.push(req.body.articulos[i].nombre)
                        }
                        let obj = {
                            articulos:articulos,
                            restaurante: req.body.restauranteNombre,
                            total: req.body.total,
                            status: "Recibido",
                            confirmacion: uuid.v4()
                        }

                        UsuariosLista.ordenar(user.user, obj)
                        .then(nuevo=>{
                            return res.status(201).json(nuevo);
                        })
                        .catch (err=>{
                            console.log(err);
                        })
                        
                    })
                    .catch((err) => {
                        throw Error(err);
                    });
            })
            .catch((err) => {
                throw Error(err);
            });
    })
});

app.put('/api/updateRestaurant/', jsonParser, (req, res) =>{
    let restaurante = req.body;
    RestaurantesLista.updateRestaurant(restaurante)
    .then((response)=>{
        return res.status(202).json(restaurante);
    })
    .catch((err)=>{
        throw Error(err);
    });
});

app.put('/api/updatePedido/', jsonParser, (req, res) =>{
    let restaurante = req.body.restaurante;
    let status = req.body.status;
    let pedido = req.body.pedido;
    RestaurantesLista.obtenerPedidos(restaurante)
    .then((response)=>{
        response[0].ordenes.forEach((element)=>{
            if(element.id==pedido){
                element.status=status;
            }
        });
        RestaurantesLista.colocarPedido(restaurante, response[0].ordenes)
        .then((response)=>{
            return res.status(202).json(pedido);
        })
        .catch((err)=>{
            throw Error(err);
        });
    })
    .catch((err)=>{
        throw Error(err);
    });
});

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            if (response) {
                return reject(response);
            }
            else {
                server = app.listen(port, () => {
                    console.log("App is running on port " + port);
                    resolve();
                })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
}


runServer(PORT, DATABASE_URL);

module.exports = {app, runServer, closeServer};