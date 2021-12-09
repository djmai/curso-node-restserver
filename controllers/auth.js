const { response } = require("express");

const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

  const { correo, password } = req.body;

  try {

    // Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      })
    }

    // Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Algo salio mal',
    })
  }

}


const googleSignin = async (req, res = response) => {

  const { id_token } = req.body;

  try {

    const { correo, nombre, img } = await googleVerify(id_token);

    // Generar referencia si existe el correo en la BD
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        img,
        password: ':P',
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Usuario bloqueado, comunicarse con el administrador'
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });

  } catch (error) {
    res.status(400).json({
      msg: 'Token de google no es valido'
    })
  }
}

module.exports = {
  login,
  googleSignin,
}