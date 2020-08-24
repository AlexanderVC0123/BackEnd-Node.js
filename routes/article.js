'use strict'

var express = require('express');
var articleController =  require('../controllers/article');

var router = express.Router();

//Se carga el modulo multiparty para poder cargar imagenes
var multipart = require('connect-multiparty');
//guardaremos los archivos en la carpeta upload/articles
var md_upload = multipart({uploadDir:'./upload/articles'});

//Rutas de prueba 
router.post('/datos-curso', articleController.datosCurso);
router.get('/test-de-controlador', articleController.test);

//Rutas utiles (para los articulos)
router.post('/save', articleController.save);
router.get('/articles/:last?', articleController.getArticles);
router.get('/article/:id', articleController.getArticle);
router.put('/article/:id', articleController.update);
router.delete('/article/:id', articleController.delete);
//ruta para subir el fichero
router.post('/upload-image/:id?', md_upload, articleController.upload);

router.get('/get-image/:image', articleController.getImage);
router.get('/search/:search', articleController.search);


module.exports = router;