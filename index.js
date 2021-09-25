const express = require('express')
const conectarDB = require('./config/db')
const cors = require ('cors');




//crear el servidor
const app = express();

console.log(`comenzando NodeSend`);


//conectar a la base de datos
conectarDB()


//habilitar cors
const opcionesCors = {
    origin:process.env.FRONTEND_URL
}
app.use(cors(opcionesCors))
//p[uerto de la app
const port = process.env.PORT || 4000;

//habilitar carpeta publica

app.use(express.static('uploads'))

//habilitar los valores de un body

app.use(express.json())



//rutas de la app
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/enlaces',require('./routes/enlaces'));
app.use('/api/archivos',require('./routes/archivos'));


//arrancar la app

app.listen(port, '0.0.0.0',()=>{
    console.log(`servidor funcionando en el puerto ${port}`)
    console.log(process.env.FRONTEND_URL)
})

