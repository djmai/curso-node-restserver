const { response } = require("express");
const { Producto, Categoria, Usuario } = require("../models");


// obtenerProductos - paginado -total - populate
const obtenerProductos = async (req = request, res = response, next) => {

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate({ path: 'usuario', model: Usuario, select: 'nombre correo' })
      .populate({ path: 'categoria', model: Categoria, select: 'nombre' })
      .skip(Number(desde))
      .limit(Number(limite))
  ]);

  res.send({ total, productos });
}

// obtenerProducto - populate {}
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate({ path: 'usuario', model: Usuario, select: 'nombre correo' })
    .populate({ path: 'categoria', model: Categoria, select: 'nombre' })

  res.json(producto);
}

// Crear producto
const crearProducto = async (req, res = response) => {

  const { estado, usuario, ...body } = req.body;

  const productoBD = await Producto.findOne({ nombre: body.nombre });

  if (productoBD) {
    return res.status(400).json({
      msg: `El producto ${productoBD.nombre}, ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  }

  const producto = new Producto(data);

  // Guardar producto
  await producto.save();

  res.status(201).json(producto);
}

// actualizarProducto
const actualizarProducto = async (req, res = response) => {

  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);

}

// borrarProducto - estado:false
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;
  const productoBorrada = await Producto.findOneAndUpdate(id, { estado: false }, { new: true });
  res.json(productoBorrada);
}


module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
}