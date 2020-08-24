// se define los metodos y rutas del API
'use strict'

var validator = require('validator');
var fs = require('fs')
var path = require('path')

var Article = require('../models/article');

var controller = {

    datosCurso: (req, res) => {

        var contacto = req.body.contacto;

        return res.status(200).send({
            curso: 'Master en frameorks de Javascript',
            editor: 'Alexander Valladares',
            contacto
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        //Recoger los parametros por Post
        var params = req.body;

        //Validar datos {validator}
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {

            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!'
            });
        }

        if (validate_title && validate_content) {

            //Crear el objeto a guardar
            var article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            //article.image = params.image;

            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            } 
            

            //Guardar el articulo 

            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado!'
                    });
                }

                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            })
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }

    },

    //Metodo para permitir sacar todos los articulos
    getArticles: (req, res) => {

        //Para sacar los ultimos 5 articulos
        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            //metemos un limite a la query para que nos muestre solo 5 articulos
            query.limit(5);
        }      
        //Find 
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar!'
                });
            }

            return res.status(200).send({
                status: 'succes',
                articles
            });
        })  
    },

    //Para sacar un unico articulo
    getArticle: (req, res)=> {

        //recoger el id de la url
        var articleId = req.params.id;

        //Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!'
            })
        }

        //Buscar el articulo
        Article.findById(articleId, (err, article) => {

            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!'
                })
            }

            //Devolverlo en JSON

            return res.status(200).send({
                status: 'success',
                article
            })
        })

        
    },

    //Actualizacion del articulo
    update: (req, res) => {

        //Recoger id del articulo por la url
        var articleId = req.params.id;

        //Recoger los datos que llegan por put
        var params = req.body;

        //Validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'No existe el articulo!'
            })
        }

        if(validate_title && validate_content){
            //Si estan validos hacer: Find and Update
            Article.findByIdAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdate) =>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar!'
                    })
                }
                if(!articleUpdate){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo!'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    articleUpdate
                })
            })
        }else{
            //Devolver la respuesta

            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta!'
            })
        }    
    },

    delete: (req, res) => {
        //REcoger el id de la url
        var articleId = req.params.id; 

        //Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar!'
                })
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista!'
                })
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            })
        })
    }, 

    upload: (req, res) => {

        //Configurar el modulo connect multiparty router/article.js (hecho en article.js de routes)

        //Recoger el fichero de la petición
        var file_name = 'Imagen no subida...'

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        //Conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;

        //*Adevertencia en Linux y Mac*
        //var file_split = file_path.split('/');

        //*Adevertencia en windows*
        var file_split = file_path.split('\\');

        //nombre del archivo
        var file_name = file_split[2];

        //extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //Comprobar la extension, solo imagenes, si es valida borrar el fichero 
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //borrar el archivo subido
            fs.unlink(file_path, () => {
                return res.status(404).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida '
                })
            })
        }else{
            //si todo es valido, sacando id de la url
            var articleId =  req.params.id;

            if(articleId){
                //Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdate) => {

                if (err || !articleUpdate){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del articulo'
                    })
                };
                
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdate
                })
            }); 
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                })
            }                
        }  
    }, //end upload file

    //Coger la imagen
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe!'
                })
            }
        })
    },

    search: (req, res) => {
        //Sacar el string a buscar
        var searchString = req.params.search;
        //find or 
        Article.find({ "$or": [
            {'title': {'$regex':searchString, '$options':'i'}},
            {'content': {'$regex':searchString, '$options':'i'}},
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion',
                })
            }
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda!'
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
                
            })
        })

        
    }
}; //end controller

module.exports = controller;
