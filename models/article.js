//Creamos modelo de los articulos del blog 
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
})

//Exportamos el modelo para poder usarlo 
module.exports = mongoose.model('Article', ArticleSchema);

//mongoose crea una coleccion articles donde guarda documentos de este tipo y esta estructura 
//dentro de la coleccion de la base de datos 
