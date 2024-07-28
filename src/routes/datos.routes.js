var express = require("express");
var router = express.Router();
var dataController = require("../controllers/datosController");
const isLoggedIn = require("../policies/isLoggedIn");
const { createDataSchema, editDataSchema } = require("../validationSchemas/data");
const middleware = require("../middlewares");

/**
 * @route GET /
 * @desc Obtener todos los datos
 * @access Public
 */
router.get("/", dataController.getAllData);

/**
 * @route GET /:id
 * @desc Obtener dato por id
 * @access Public
 */
router.get("/:id", dataController.getDataById);

/**
 * @route POST /
 * @desc Crear dato
 * @access Logged
 */
router.post(
  "/",
  isLoggedIn,
  middleware.validateRequestBody(createDataSchema),
  dataController.createData
);

/**
 * @route PUT /:id
 * @desc Actualizar dato por id
 * @access Logged
 */
router.put(
  "/:id",
  isLoggedIn,
  middleware.validateRequestBody(editDataSchema),
  dataController.updateData
);

/**
 * @route DELETE /:id
 * @desc Eliminar dato por id
 * @access Logged
 */
router.delete("/:id", isLoggedIn, dataController.deleteData);
/**
 * @route POST /
 * @desc Exportar datos del sensor a un archivo xlxs
 * @access Public
 */
router.post(
  "/export",
  //middleware.validateRequestBody(editDataSchema),
  dataController.exportData
);
module.exports = router;
