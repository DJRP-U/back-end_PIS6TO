const express = require("express");
const rolRouter = require("./role.routes");
const accountRouter = require("./account.routes");
const authRouter = require("./auth.routes");
const datosRouter = require("./datos.routes");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.use("/auth", authRouter);
router.use("/role", rolRouter);
router.use("/account", accountRouter);
router.use("/data", datosRouter);

module.exports = router;