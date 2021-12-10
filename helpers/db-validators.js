const { Role, Usuario, Categoria, Producto, } = require('../models');

// Verificar si el rol es valido
const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
}

// Verificar si el correo existe
const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo}, ya está registrado`);
  }
}

// Verificar si usuario existe por id
const existeUsuarioPorId = async (id = '') => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id: ${id}, no existe`);
  }
}


// Verificar si la categoria existe por id
const existeCategoriaPorId = async (id = '') => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`La categoría con id: ${id}, no existe`);
  }
}

// Verificar si el producto existe por id
const existeProductoPorId = async (id = '') => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El producto con id: ${id}, no existe`);
  }
}


module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
}