/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario} = require ('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios ); //se encarga de retornar todos los usuarios

router.post('/', 
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        validarCampos,
    ],
crearUsuario ); //se encarga de crear un usuario

router.put( '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampos,
    ], 
    actualizarUsuario
);

router.delete( '/:id', validarJWT, eliminarUsuario);

module.exports = router;