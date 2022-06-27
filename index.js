require('dotenv').config();
const express = require ('express');
const cors = require('cors');

const { dbConnection } = require ('./database/config');

//CREAR EL SERVIDOR DE EXPRESS
const app = express();

//CONFIGURAR CORS
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );

//BASE DE DATOS ↓
dbConnection();

//USER & PASS MONGO ↓
//mean_user
//bkSLhufQMJTwD9y0

//RUTAS ↓
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto= ' + process.env.PORT);
});