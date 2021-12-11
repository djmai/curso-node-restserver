
const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

  return new Promise((resolve, reject) => {

    const { archivo } = files;
    const nombreCorto = archivo.name.split('.');
    const extension = nombreCorto[nombreCorto.length - 1];

    // Validar extensión
    if (!extensionesValidas.includes(extension)) {
      reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`);
    }

    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err)
        rejecet(err);

      resolve(nombreTemp);
    });

  })
}

module.exports = {
  subirArchivo
}