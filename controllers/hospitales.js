const { response } = require ('express');
const Hospital = require ('../models/hospital');

const getHospitales = async (req, res= response ) => {
    //lo que sigue a continuacion del find es para saber los datos 
    //del usuario
    const hospitales = await Hospital.find()
                                        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async( req, res = response ) => {

    const uid = req.uid;
    const hospital = new Hospital ({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();
        
        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Hable con el admin'
        })
    }
}

const actualizarHospital = (req, res) => {
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    })
}

const eliminarHospital = (req, res) => {
    res.json({
        ok: true,
        msg: 'deleteHospital'
    })
}

module.exports = { 
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}