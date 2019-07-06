const router = require("express").Router();
const busRoutes = require("./bus");
const appRoutes = require("./app")
const authRoutes = require("./auth")

// Book routes
router.use("/bus", busRoutes);
router.use("/app", appRoutes);
router.use("/user", authRoutes);

module.exports = router;