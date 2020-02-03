let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let {DATABASE_URL, PORT} = require("./config");
let {RestaurantesLista, UsuariosLista, PerfilesLista} = require("./model");

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

app.get('/api/historial', (req, res)=>{
    
})

app.get('/api/allRestaurants', (req, res)=>{
    RestaurantesLista.getAll()
        .then((result)=>{
            return res.status(200).json(result);
        })
        .catch((err)=>{
            throw Error(err);
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
        UsuariosLista.historial(user)
            .then(historial=>{
                return res.status(200).json(historial);
            })
            .catch(error=>{
                console.log(error);
                return res.status(500).send();
            })
    })
})


app.post('/api/login', jsonParser, (req, res)=>{
    let user = req.body.user;
    let password = req.body.password;
    PerfilesLista.buscarCorreo(user)
        .then(resultado=>{
            if(resultado){
                if(resultado.password === password){
                    let data = {
                        user
                    };
                    let token = jwt.sign(data, 'secret', {
                        expiresIn: 60 * 5
                    });

                    return res.status(200).json({ token });
                }else{
                    return res.status(209).send();
                }
                
            }else{
                return res.status(404).send();
            }
        })
        .catch(error=>{
            return res.status(500).send();
        });
})






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