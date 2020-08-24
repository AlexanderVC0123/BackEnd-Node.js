'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900


mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/api_rest_blog", {useNewUrlParser: true})
    .then(()=>{
        
        console.log('la conexión a la base de dato se ha realizado con correctamente!!')
        //Crear servidor y ponerme a escuchar peticiones http
        app.listen(port,()=>{
            console.log('servidor corriendo en http://localhost:'+port)
        })
    })