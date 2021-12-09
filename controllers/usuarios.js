const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response, next) => {

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
  ]);

  res.send({ total, usuarios });
}

const usuariosPost = async (req, res = response) => {

  // Retornamos los errores de validación
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await usuario.save();

  // Retornamos los datos registrados
  res.send(usuario);
}

const usuariosPut = async (req, res = response) => {

  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.send(usuario);
}

const usuariosPatch = (req, res = response) => {
  res.send({
    msg: 'patch API - Controller'
  });
}

const usuariosDelete = async (req, res = response) => {

  const { id } = req.params;

  // Borrado fisicamente
  // const usuario = await Usuario.findByIdAndDelete(id);

  // Borrado digital para mantener la integridad
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.send(usuario);
}




module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
}