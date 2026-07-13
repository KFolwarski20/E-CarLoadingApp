// @desc Post charging Optimal Widnow
// @route POST /api/charing/optimal-window
// @access public

const asyncHandler = require("express-async-handler");

const { 
  calculateCleanPercentage 
} = require("../utils/helpers");

const {
  getGenerationData
} = require("../services/ExternalApiService")


exports.chargingOptimalWindow = asyncHandler(async (req, res) => {
  const { durationHours } = req.body;
  
  if (
    !Number.isInteger(durationHours) || 
    durationHours < 1 || 
    durationHours > 6
    ){
      return res.status(400).json({
        error: "Provided value must be an integer between 1 and 6!"
      });
  }
  
  const data = await getGenerationData(1,2);
  
  const slots = data.map(entry => ({
    from: entry.from,
    to: entry.to,
    clean: calculateCleanPercentage(entry.generationmix)
  }));
  
  const windowSize = durationHours * 2;
  
  let best = null;
  
  for (let i = 0; i <= slots.length - windowSize; i++) {
    let sum = 0;
  
    for (let j = 0; j < windowSize; j++) {
      sum += slots[i + j].clean;
    }
  
    const avg = Number(sum / windowSize).toFixed(2);
  
    if (!best || avg > best.averageCleanPercentage) {
      best = {
        start: slots[i].from,
        end: slots[i + windowSize - 1].to,
        averageCleanPercentage: avg
      };
    }
  }
  
  res.json(best);
});