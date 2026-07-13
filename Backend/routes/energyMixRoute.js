const express = require("express");

const router = express.Router();

const { getEnergyMix } = require("../controllers/energyMixController");

router.route("/").get(getEnergyMix);

module.exports = router;