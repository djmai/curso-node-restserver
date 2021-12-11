const { Router } = require('express');
const { check } = require('express-validator');
const { buscar } = require('../controllers/buscar');


const router = Router();
/**
 * *{{url}}/api/uploads
 * */

router.get(
  '/:coleccion/:termino',
  [
    // check('id_token', 'El id_token es obligatorio').not().isEmpty(),
    // validarCampos,
  ],
  buscar
);

module.exports = router;