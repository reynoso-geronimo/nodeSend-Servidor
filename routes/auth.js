const express= require('express')
const router= express.Router();
const authController= require('../controllers/authController')
const { check }= require('express-validator')
const auth = require('../middleware/auth')

router.post('/',[
    check('email','Ingresa un email valido').isEmail(),
    check('password','Ingresa tu password').not().isEmpty()
],
 authController.autenticarUsuario);

router.get('/',
 auth,
 authController.usuarioAutenticado)

module.exports= router