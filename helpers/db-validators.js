const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
}