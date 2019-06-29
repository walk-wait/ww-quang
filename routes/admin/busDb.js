const router = require("express").Router();
const adminController = require("../../controllers/adminController");

// Matches with "/admin/busDb/routes"
router.route("/routes")
  .get()

module.exports = router;