// @desc Get energy mix
// @route GET /api/energy/mix
// @access public

const asyncHandler = require("express-async-handler");

const {
    groupByDay,
    calculateDailyAverages
} = require("../utils/helpers");

const {
  getGenerationData
} = require("../services/ExternalApiService");

const getEnergyMix = asyncHandler(async (req, res) => {
  
  const data = await getGenerationData(0,3);
  
  const grouped = groupByDay(data);
  
  const result = {};
  
  Object.keys(grouped).forEach(day => {
    result[day] = calculateDailyAverages(grouped[day]);
  });
  
  res.json(result);
  });

  module.exports = { getEnergyMix }