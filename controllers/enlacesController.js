const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt= require ('bcrypt')
const {validationResult}= require('express-validator')

exports.nuevoEnlace = async (req, res, next) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }


  //crear un objeto enlace
  const { nombre_original, nombre } = req.body;

  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;

  
  //si el usuario esta autenticado

  if (req.usuario) {
    const { password, descargas } = req.body;
    if (password) {
        const salt = await bcrypt.genSalt(10);

      enlace.password = await bcrypt.hash(password,salt);
    }
    if (descargas) {
      enlace.descargas = descargas;
    }
    //asignar el autor
    enlace.autor= req.usuario.id

  }

  //almacenar el enlace en la base de datos
  try {
    await enlace.save();
    res.json({ msg: `${enlace.url}` });
    return next();
  } catch (error) {
    console.log(error);
    return next();
  }
};

//obtener todos los enlaces
exports.todosEnlaces= async (req,res)=>{
  try {
    const enlaces= await Enlaces.find({}).select('url -_id');
    res.json({enlaces})
  } catch (error) {
    console.log(error)
  }
}
//retorna si el enlace tiene password o no
exports.tienePassword= async (req,res,next)=>{
  const { url }=req.params;

  const enlace= await Enlaces.findOne({url})
  if(!enlace){
    res.status(404).json({msg: '404 ese Enlace no existe'})
    return next()
  }
  if(enlace.password){
    return res.json({password: true, enlace: enlace.url})
  }
  next()
}

//verficica si el password es correcto
exports.verificarPassword= async (req,res,next)=>{
  
  const {url}= req.params

  const {password}=req.body
  //consultar por el enlace
  const enlace= await Enlaces.findOne({url})
  //verificar el password

  if(bcrypt.compareSync(password, enlace.password)){
    //permitir descargar el archivo
    next()

  }else{
    return res.status(401).json({msg:'Password Incorrecto'})
  }

}

//obtener el enlace
exports.obtenerEnalce= async (req,res,next)=>{
  const { url }=req.params;

  const enlace= await Enlaces.findOne({url})
  if(!enlace){
    res.status(404).json({msg: '404 ese Enlace no existe'})
    return next()
  }
  res.json({archivo:enlace.nombre, password: false})
  next()
  // so descarga >1 descaraga-1

}