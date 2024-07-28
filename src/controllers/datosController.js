const Data = require("../models/Datos");
const xlsx = require('xlsx');
module.exports = {
  getAllData: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;
    const allData = await Data.find(where).skip(skip).limit(limit);
    const numberData = await Data.countDocuments(where);
    res.json({ numberData, allData });
  },

  getDataById: async (req, res) => {
    const { id } = req.params;
    const data = await Data.findById(id);
    if (!data) {
      return res.status(404).json({ status: 404, message: "Dato no encontrado" });
    }
    return res.json(data);
  },

  createData: async (mqdata) => {
    try {
      console.log(mqdata);
      const data = new Data(mqdata);
      console.log(data);
      await data.save();
      return { status: 201, data };
    } catch (error) {
      return { status: 400, error: "Error al crear el dato", details: error };
    }
  },

  updateData: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Data.findByIdAndUpdate(id, req.body, { new: true });
      if (!data) {
        return res.status(404).json({ status: 404, message: "Dato no encontrado" });
      }
      return res.json(data);
    } catch (error) {
      res.status(400).json({ status: 400, message: "Error al actualizar el dato", error });
    }
  },

  deleteData: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Data.findByIdAndDelete(id);
      if (!data) {
        return res.status(404).json({ status: 404, message: "Dato no encontrado" });
      }
      return res.json({ status: 200, message: "Dato eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ status: 400, message: "Error al eliminar el dato", error });
    }
  },
};

module.exports = {
  getAllData: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;
    const allData = await Data.find(where).skip(skip).limit(limit);
    const numberData = await Data.countDocuments(where);
    res.json({ numberData, allData });
  },

  getDataById: async (req, res) => {
    const { id } = req.params;
    const data = await Data.findById(id);
    if (!data) {
      return res.status(404).json({ status: 404, message: "Dato no encontrado" });
    }
    return res.json(data);
  },

  createData : async (mqdata) => {
    try {
      console.log('Datos recibidos:', mqdata);
      const data = new Data(mqdata);
      console.log('Objeto Data creado:', data);
      const savedData = await data.save();
      console.log('Datos guardados exitosamente:', savedData);
      return savedData;
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      throw error; // Re-lanzar el error para manejarlo en el nivel superior si es necesario
    }
  },
  exportData: async (req, res) => {
    try {
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate y endDate se requieren ' });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      console.log(start.toISOString());
      console.log(end.toISOString());
      const allData = await Data.find({
        "timestamp": { $gte: start.toISOString(), $lte: end.toISOString() }
      });
      if (!allData.length) {
        return res.status(404).json({ error: 'No data found for the given date range' });
      }

      

      // Preparar datos para el archivo Excel
      const dataToExport = allData.map(data => ({
        temperatura: data.temperatura,
        humedad: data.humedad,
        co2: data.co2,
        timestamp: data.timestamp
      }));

      // Crear un nuevo libro de trabajo y una hoja de trabajo
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(dataToExport);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

      // Escribir el archivo a un buffer
      const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      // Enviar el archivo al cliente
      res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error);
    }
  },
  updateData: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Data.findByIdAndUpdate(id, req.body, { new: true });
      if (!data) {
        return res.status(404).json({ status: 404, message: "Dato no encontrado" });
      }
      return res.json(data);
    } catch (error) {
      res.status(400).json({ status: 400, message: "Error al actualizar el dato", error });
    }
  },

  deleteData: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Data.findByIdAndDelete(id);
      if (!data) {
        return res.status(404).json({ status: 404, message: "Dato no encontrado" });
      }
      return res.json({ status: 200, message: "Dato eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ status: 400, message: "Error al eliminar el dato", error });
    }
  },
};
