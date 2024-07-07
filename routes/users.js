var express = require('express');
var router = express.Router();
let jwt = require("jsonwebtoken");
const personaC = require('../app/controls/PersonaControl');
let personaControl = new personaC();
const rolC = require('../app/controls/RolControl');
let rolControl = new rolC();
const cuentaC = require('../app/controls/CuentaControl');
let cuentaControl = new cuentaC();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('reporte de sexto');
});

//MIDDLEWARE
const auth = function middleware(req, res, next){
  //AUTENTICACION
  const token = req.headers['pis-token'];
  if(token === undefined){
    res.status(400);
    res.json({ msg: "ERROR", tag: "Falta token", code: 400 });
  }else{
    require('dotenv').config();
    const key = process.env.KEY_JWT;
    jwt.verify(token, key, async(error, decoded) => {
      if(error){
        res.status(400);
        res.json({ msg: "ERROR", tag: "TOKEN NO VALIDO O EXPIRADO", code: 400 });
      }else{
        console.log(decoded.external);
        const models = require('../app/models');
        const cuenta = models.cuenta;
        const aux = await cuenta.findOne({
          where: {external_id : decoded.external}
        });
        if(aux === null){
          res.status(400);
        res.json({ msg: "ERROR", tag: "TOKEN NO VALIDO", code: 400 });
        }else{
          //AUTORIZACION
          next();
        }
      }
      
    });
    
  }
}


router.get('/admin/personas', personaControl.listar);
router.get('/admin/personas/get/:external', auth, personaControl.obtener);
router.post('/admin/personas/save',  personaControl.guardar);
router.put('/admin/personas/put/:external', auth, personaControl.modificar);
router.get('/admin/personas/cambiarEstado/:external/:nuevoEstado', auth, personaControl.cambiarEstado);

router.get('/admin/rol', rolControl.listar);
router.post('/admin/rol/save', rolControl.guardar);

router.post('/login', cuentaControl.inicio_sesion);
module.exports = router;