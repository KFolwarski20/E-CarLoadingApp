const express = require("express");

const router = express.Router();

const { chargingOptimalWindow } = require("../controllers/chargingOptimalWindowController");

router.route("/").post(chargingOptimalWindow);

module.exports = router;