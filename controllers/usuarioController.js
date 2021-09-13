const Usuario = require('../models/Usuario')

exports.nuevoUsuario = async (req,res)=>{
    //verificar si el usuario ya esta registrado
    const { email }=req.body;
    let usuario = await Usuario.findOne({email});
    if(usuario){
        return res.status(400).json({msg: 'El usuariuo ya esta registrado'})
    }

    usuario = await new Usuario(req.body);
    usuario.save()
    res.json({msg: 'Usuario creado correctamente'})
}