const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
  'categorias',
  'productos',
  'roles',
  'usuarios',
  'productosCategoria'
];

const buscarUsuarios = async (termino = '', res = response) => {

  const isMongoID = ObjectId.isValid(termino);

  if (isMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: (usuario) ? [usuario] : []
    });
  }

  const regex = new RegExp(termino, 'i');

  const usuarios = await Usuario.find({
    $or: [
      { nombre: regex },
      { correo: regex },
    ],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios
  });

}

const buscarCategorias = async (termino = '', res = response) => {

  const isMongoID = ObjectId.isValid(termino);

  if (isMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: (categoria) ? [categoria] : []
    });
  }

  const regex = new RegExp(termino, 'i');

  const categorias = await Categoria.find({ nombre: regex, estado: true });

  res.json({
    results: categorias
  });

}

const buscarProductos = async (termino = '', res = response) => {

  const isMongoID = ObjectId.isValid(termino);

  if (isMongoID) {
    const producto = await Producto.findById(termino)
      .populate('categoria', 'nombre')
      .populate('usuario', 'nombre');

    return res.json({
      results: (producto) ? [producto] : []
    });
  }

  const regex = new RegExp(termino, 'i');

  // const productos = await Producto.find({ nombre: regex, estado: true });
  const productos = await Producto.find({
    $or: [
      { nombre: regex },
      { descripcion: regex },
    ],
    $and: [{ estado: true }],
  })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');


  res.json({
    results: productos
  });

}

const buscarProductosCategoria = async (termino = '', res = response) => {

  const isMongoID = ObjectId.isValid(termino);

  if (isMongoID) {
    const producto = await Producto.find({ categoria: ObjectId(termino), estado: true })
      .populate('categoria', 'nombre')
      .populate('usuario', 'nombre');

    return res.json({
      results: (producto) ? [producto] : []
    });
  }
}

const buscar = (req, res = response) => {

  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    })
  }

  switch (coleccion) {
    case 'categorias':
      buscarCategorias(termino, res);
      break;
    case 'productos':
      buscarProductos(termino, res);
      break;
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;
    case 'productosCategoria':
      buscarProductosCategoria(termino, res);
      break;
    default:
      res.status(500).json({
        msg: 'Busqueda no disponible'
      })
      break;
  }
}

module.exports = {
  buscar,
}