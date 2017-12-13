var express = require('express');
var Crud = require('./crud-mongodb').Crud;

var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true  }));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

var Crud= new Crud('localhost', 27017);

app.get('/', function(req, res){
  Crud.listarTodo( function(error,docs){
    if(error) {
      console.log("mongo db error"+error);
      docs = [];
    }
    res.render('index.jade', {titulo: 'Blog', articulos:docs});
  })
});

app.get('/blog/nuevo', function(req, res) {
    res.render('blog_nuevo.jade', {titulo: 'Nuevo artículo' });
});

app.post('/blog/nuevo', function(req, res){
  Crud.Guardar({
      titulo: req.body.titulopost,
      texto: req.body.textopost
    }, function( error, docs) {
      res.redirect('/')
    });

});


app.get('/blog/:id', function(req, res) {
    var ObjetoId = require('mongodb').ObjectID;
    var id = ObjetoId.createFromHexString(req.params.id);
    Crud.encontrarPorId(id, function(error, articulo) {
        res.render('blog_mostrar.jade', {titulo: articulo.titulo, articulo:articulo});
    });
});


app.post('/blog/ponComentario', function(req, res) {
    var ObjetoId = require('mongodb').ObjectID;
    var articuloId = ObjetoId.createFromHexString(req.body._id);

    Crud.ponComentarioAlArticulo(articuloId, {
        autorcomentario: req.body.autorcomentario,
        comentario: req.body.comentario
       } , function( error, docs) {
           res.redirect('/blog/' + req.body._id)
       });
});
module.exports = app
//app.listen(3001);
