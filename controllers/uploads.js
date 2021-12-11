const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res = response) => {

  try {
    // Imagenes
    const nombre = await subirArchivo(req.files, undefined, 'imgs');
    res.json({ nombre });
  } catch (error) {
    res.status(400).json({ msg: error })
  }

}

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el usuario con el id ${id}`
        });
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el producto con el id ${id}`
        });
      }

      break;

    default:
      return res.statu(500).json({ msg: 'Se me olvido validar esto' });
  }


  // Limpiar imagenes previas
  if (modelo.img) {
    // Borra la imagen del servidor
    const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;


  await modelo.save();

  res.json(modelo);
}

const mostrarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el usuario con el id ${id}`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el producto con el id ${id}`
        });
      }
      break;

    default:
      return res.statu(500).json({ msg: 'Se me olvido validar esto' });
  }


  // Limpiar imagenes previas
  if (modelo.img) {
    // Borra la imagen del servidor
    const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }

  const pathImage = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImage);

}


const actualizarImagenCloudinary = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el usuario con el id ${id}`
        });
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el producto con el id ${id}`
        });
      }

      break;

    default:
      return res.statu(500).json({ msg: 'Se me olvido validar esto' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
}