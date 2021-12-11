const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.get(
  '/:coleccion/:id',
  [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
  ],
  mostrarImagen
)

router.post(
  '/',
  [
    validarArchivoSubir,
  ],
  cargarArchivo
)

router.put(
  '/:coleccion/:id',
  [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
  ],
  // actualizarImagen
  actualizarImagenCloudinary
)

module.exports = router;