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

//obtener el enlace
exports.obtenerEnalce= async (req,res,next)=>{
  const { url }=req.params;

  const enlace= await Enlaces.findOne({url})
  if(!enlace){
    res.status(404).json({msg: '404 ese Enlace no existe'})
    return next()
  }
  res.json({archivo:enlace.nombre})
  next()
  // so descarga >1 descaraga-1

}