const mongoose = require('mongoose');
const Schema = mongoose.Schema; //cambio

const dataSchema = new mongoose.Schema({
  temperatura: {
    type: Number,
    required: true
  },
  humedad: {
    type: Number,
    required: true
  },
  co2: {
    type: Number,
    required: true
  },
  timestamp: {
    type: String, // Cambia el tipo a String para evitar conversión automática
    required: true
  },
  external_id: {
    type: String,
    required: false,
    unique: false
  }
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
