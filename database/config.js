const mongoose = require('mongoose');



const dbConnection = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_CN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Base de datos online');

  } catch (error) {
    console.log(error);
    throw new Error('Error al inicializar la db');
  }
}

module.exports = { dbConnection };