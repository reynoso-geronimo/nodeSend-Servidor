const shortid= require('shortid')
const multer= require('multer');
const fs= require('fs');
const Enlaces= require('../models/Enlace')

exports.subirArchivo = async (req,res,next)=>{

    
const configuracionMulter = {
    limits:{ fileSize : req.usuario ? 1024*1024*10 : 1024*1024},
    storage: filleStorage= multer.diskStorage({
        destination:(req, file , cb)=>{
            cb(null, __dirname+'/../uploads')
        },
        filename:(req,file,cb)=>{
            const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
            cb(null, `${shortid.generate()}${extension}`)
            //const extension = file.mimetype.split('/')[1];
            //cb(null, `${shortid.generate()}.${extension}`)
        },
        
    })
   
}
const upload = multer(configuracionMulter).single('archivo');


    upload(req,res, async(error)=>{
        console.log(req.file);
        if(!error){
            res.json({archivo: req.file.filename})
        }else{
            console.log(error, `error aqui`)
            return next()
        }
    })
}

exports.eliminarArchivo= async (req,res)=>{
   
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log(`archivo elminado`)
    } catch (error) {
        console.log(error)
    }
}

exports.descargar= async (req,res, next)=>{

    //obtiene el enalce
    const {archivo}= req.params
    const enlace= await Enlaces.findOne({ nombre:archivo})

    const archivoDescarga =__dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    //eliminar el archivo y la entrada de la DB
    const {descargas, nombre} = enlace
    //si las descargas son iguales a 1 -borrar la entrada y el archivo
    if(descargas===1){
     
  
    
      //eliminar el archivo
      req.archivo= nombre
  
      //eliminar la entrada de la base de datos
      await Enlaces.findOneAndRemove(enlace.id)
  
      next()
    }else{
      enlace.descargas--;
      await enlace.save();
      
    }
}