const router = require("express").Router();
const appController = require("../../controllers/appController");

// Matches with "/api/bus/latlon/:lat/:lon"
router.route("/latlon/:lat/:lon")
  .get(appController.findNearBy)

// Matches with "/api/bus/nextstops/:route/:direction/:id"
router.route("/nextstops/:route/:direction/:id")
  .get(appController.findStops)    

module.exports = router;