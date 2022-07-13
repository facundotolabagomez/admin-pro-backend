const { response } = require ('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        //verificar mail
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //verificar passw
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña invalida'
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT (usuarioDB.id);

        res.json({
            ok:true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Pasaron cosas...Hable con el admin'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    try {
        const { email, name, picture } = await googleVerify ( req.body.token );

        const usuarioDB = await Usuario.findOne ({ email });
        let usuario;

        if ( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar usuario
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT (usuario.id);

        res.json({
            ok: true,
            email, name, picture,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'TOKEN de Google No es correcto'
        });
    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    
    //Generar el TOKEN - JWT
    const token = await generarJWT (uid);

    res.json({
        ok: true,
        token
    });
}


module.exports = {
    login,
    googleSignIn,
    renewToken
}