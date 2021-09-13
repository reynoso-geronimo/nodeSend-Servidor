const Usuario = require ('../models/Usuario')
const bcrypt= require ('bcrypt')

exports.autenticarUsuario = async (req,res,next)=>{
    //revisar errores

    //buscar el usuario
    const {email, password}= req.body
    const usuario = await Usuario.findOne({email})
    console.log(usuario)
    if(!usuario){
        res.status(401).json({msg: 'El usuario no existe'})
        return next();
    }

   
    //verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)){
        console.log('el password es correcto')
    }
    else{
        res.status(401).json({msg:"Password Incorrecto"});
        return next();
    }
}

exports.usuarioAutenticado = async (req,res)=>{

}