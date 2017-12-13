var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Crud = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


Crud.prototype.obtenerColeccion= function(callback) {
  this.db.collection('articulos', function(error, coleccion) {
    if( error ) callback(error);
    else callback(null, coleccion);
  });
};

Crud.prototype.listarTodo = function(callback) {
    this.obtenerColeccion(function(error, coleccion) {
      if( error ) callback(error)
      else {
        coleccion.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


Crud.prototype.encontrarPorId = function(id, callback) {
    this.obtenerColeccion(function(error, coleccion) {
      if( error ) callback(error)
      else {
        coleccion.findOne({_id: id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

Crud.prototype.Guardar = function(articulos, callback) {
    this.obtenerColeccion(function(error, coleccion) {
      if( error ) callback(error)
      else {
        if( typeof(articulos.length)=="undefined")
          articulos = [articulos];

        for( var i =0;i< articulos.length;i++ ) {
          article = articulos[i];
          article.fecha = new Date();
          if( article.comentarios === undefined ) article.comentarios = [];
          for(var j =0;j< article.comentarios.length; j++) {
            article.comentarios[j].fecha = new Date();
          }
        }

        coleccion.insert(articulos, function() {
          callback(null, articulos);
        });
      }
    });
};

Crud.prototype.ponComentarioAlArticulo = function(articuloId, comentario, callback) {
  this.obtenerColeccion(function(error, coleccion) {
    if( error ) callback( error );
    else {
      coleccion.update(
        {_id: articuloId},
        {"$push": {comentarios: comentario}},
        function(error, article){
          if( error ) callback(error);
          else callback(null, article)
        });
    }
  });
};

exports.Crud = Crud;