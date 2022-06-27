const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path ) => {
    if (fs.existsSync( path )) {
        //borrar la img anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async ( tipo, id, nombreArchivo ) => {

    switch ( tipo) {
        case 'medicos':
            const medico = await Medico.findById (id);
            if( !medico ) {
                console.log('No es un médico por id');
                return false;
            }
            
            const pathViejoMed = `./uploads/medicos/${ medico.img }`;
            borrarImagen( pathViejoMed );

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        break;

        case 'hospitales':
            const hospital = await Hospital.findById (id);
            if( !hospital ) {
                console.log('No es un hospital por id');
                return false;
            }
            
            const pathViejoHosp = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen( pathViejoHosp );

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;

        case 'usuarios':
            const usuario = await Usuario.findById (id);
            if( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }
            
            const pathViejoUsua = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen( pathViejoUsua );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;
    
        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}