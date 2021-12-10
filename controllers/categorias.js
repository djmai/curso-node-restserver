const { response } = require("express");
const { Categoria, Usuario } = require("../models");


// obtenerCategorias - paginado -total - populate
const obtenerCategorias = async (req = request, res = response, next) => {

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      // .populate('usuario', 'nombre')
      .populate({ path: 'usuario', model: Usuario, select: 'nombre correo' })
  ]);

  res.send({ total, categorias });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id)
    .populate({ path: 'usuario', model: Usuario, select: 'nombre correo' });

  res.json(categoria);
}

// Crear categoria
const crearCategoria = async (req, res = response) => {

  const nombre = req.body.nombre.toUpperCase();

  const categoriaBD = await Categoria.findOne({ nombre });

  if (categoriaBD) {
    return res.status(400).json({
      msg: `La categoría ${categoriaBD.nombre}, ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  }

  const categoria = new Categoria(data);

  await categoria.save();

  res.json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {

  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json(categoria);

}

// borrarCategoria - estado:false
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoriaBorrada = await Categoria.findOneAndUpdate(id, { estado: false }, { new: true });

  res.json(categoriaBorrada);
}


module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
}