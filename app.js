'use strict'

//Cargar módulos de node para crear servidor 
//Se carga express por que e el modulo que conectará el servidor, body-parser para recibir las peticiones
var express = require('express');
var bodyParser = require('body-parser');

//var cors = require('cors');


//Ejecutar express (http)
var app = express();

//Cargar ficheros rutas
var article_routes = require('./routes/article');


//app.use(cors());

//Middlewares
  //urlencoded se carga en bodyParser
  //.json sirve para convertir en un objeto json las peticiones 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//CORS(acceso cruzado entre dominio, para permitir las llamadas http o ajax a la api desde el front end, si no se configura esto el api bloqeua las peticiones)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
}); 



//Añadir prefijos a rutas/cargar rutas

app.use('/api', article_routes);

//Exportar módulo (fichero actual)
module.exports = app;