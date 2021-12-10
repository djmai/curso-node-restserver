const { Router } = require('express');
const { check } = require('express-validator');


const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * *{{url}}/api/productos
 * */

// Obtener todos los productos
router.get('/', obtenerProductos)

// Obtener un producto por id - publico
router.get(
  '/:id',
  [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto,
);

// Crear producto - privado - cualquier persona con token valido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria', 'La categoría no es un id de mongo valido').isMongoId(),
    validarCampos,
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto,
);

// Actualizar producto - privado - cualquiera con token valido
router.put(
  '/:id',
  [
    validarJWT,
    // check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('id', 'No es un id de mongo valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto,
);

// Borrar producto - privado - Admin con token valido
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);


module.exports = router;