'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const app2 =require('./app2')
const config = require('./config')

mongoose.connect(config.db,{ useMongoClient: true }, (err, res) => {
  if (err) {
    return console.log(`Error al conectar a la base de datos: ${err}`)
  }
  console.log('Conexión a la base de datos establecida...')

  app2.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`)
  })
})

