const mqtt = require('mqtt');
const mongoose = require('mongoose');
const Data = require('../models/Datos'); 
const Node = require('../models/Node'); 
const dataController = require('../controllers/datosController');

const mqttBrokerUrl = 'mqtt://172.168.129.50';

const topicDatos = 'datos/POST';
const topicConf = 'conf/POST';

const mqttClient = mqtt.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
  console.log('Conectado al broker MQTT');
  mqttClient.subscribe(topicDatos, (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err);
    } else {
      console.log(`Suscrito al canal: ${topicDatos}`);
    }
  });
  mqttClient.subscribe(topicConf, (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err);
    } else {
      console.log(`Suscrito al canal: ${topicConf}`);
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  console.log(`Mensaje recibido en el canal ${topic}: ${message.toString()}`);

  try {
    let data = JSON.parse(message.toString());
    if (topic === topicDatos) {
      // No convertir el timestamp, mantenerlo tal como llega
      // Agregar external_id si es necesario y no está presente
      if (!data.external_id) {
        data.external_id = new mongoose.Types.ObjectId().toString();
      }
      const result = await dataController.createData(data);
      if (result.status === 201) {
        console.log('Datos guardados exitosamente:', result.data);
      } else {
        console.error('Error al crear el dato:', result);
      }
    } else if (topic === topicConf) {
      const { nodeId, ip } = data;
      const result = await Node.findByIdAndUpdate(nodeId, { ip }, { new: true });
      console.log('IP del nodo actualizada correctamente:', result);
    }

  } catch (error) {
    console.error('Error al procesar o guardar el mensaje:', error);
  }
});
