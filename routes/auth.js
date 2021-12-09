const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');
const { login, googleSignin } = require('../controllers/auth');

const router = Router();

router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);


router.post(
  '/google',
  [
    check('id_token', 'El id_token es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  googleSignin
);

module.exports = router;