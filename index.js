require('dotenv').config();
const express = require ('express');
const cors = require('cors');

const { dbConnection } = require ('./database/config');

//CREAR EL SERVIDOR DE EXPRESS
const app = express();

//CONFIGURAR CORS
app.use( cors() );

//BASE DE DATOS ↓
dbConnection();

//USER & PASS MONGO
//mean_user
//bkSLhufQMJTwD9y0

//RUTAS ↓
app.get('/', (req, res)=>{
    res.json({ok: true,
            msg: 'Hola Mundo',
    })
});

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto= ' + process.env.PORT);
});