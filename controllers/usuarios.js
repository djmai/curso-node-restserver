const { response, request } = require('express');

const usuariosGet = (req = request, res = response, next) => {

  const { query } = req.query;

  res.send({
    msg: 'get API - Controller',
    query,
  });
}

const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;

  res.send({
    msg: 'post API - Controller',
    nombre,
    edad
  });
}

const usuariosPut = (req, res = response) => {

  const id = req.params.id;

  res.send({
    msg: 'put API - Controller',
    id,
  });
}

const usuariosPatch = (req, res = response) => {
  res.send({
    msg: 'patch API - Controller'
  });
}

const usuariosDelete = (req, res = response) => {
  res.send({
    msg: 'delete API - Controller'
  });
}




module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
}