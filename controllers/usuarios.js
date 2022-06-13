const { response } = require('express');
//const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const res = require('express/lib/response');
const { findByIdAndUpdate } = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res)=>{
    const usuario = await Usuario.find({}, 'nombre email role');
    res.json({
        ok: true,
        usuario,
    });
}

const crearUsuario = async(req, res = response )=>{
    
    const { email, password, nombre } = req.body;

    try{
        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        const usuario = new Usuario( req.body ); //instancia de usuario
        
        //Encriptando la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        
        //Guardar usuario
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            usuario,
            token
        });

    }catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

const actualizarUsuario = async ( req, res = response ) => {

    const uid = req.params.id;

    try{
        const usuarioDB = await Usuario.findById( uid );
        
        if (!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese ID'
            });
        }

        //Update
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({ email: req.body.email});
            if ( existeEmail ){
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuario con este email'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new:true} );
        
        res.json({
            ok:true,
            usuario: usuarioActualizado
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}
const eliminarUsuario = async ( req, res = response ) => {
    
    const uid = req.params.id;
    try {
        
        const usuarioDB = await Usuario.findById( uid );
        
        if (!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese ID'
            });
        }
        
        await Usuario.findByIdAndDelete (uid);

        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error'
        })        
    }
}

module.exports= {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}