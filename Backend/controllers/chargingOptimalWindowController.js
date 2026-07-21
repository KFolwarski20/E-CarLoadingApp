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
  
  const data = await getGenerationData(0,3);

  const actualTime = new Date(
    new Date().toLocaleString("en-US")
  );
  
  const slots = data.map(entry => ({
    from: entry.from,
    to: entry.to,
    clean: calculateCleanPercentage(entry.generationmix)
  }))
  .filter(slot => new Date(slot.from) > actualTime);
  
  const windowSize = durationHours * 2;
  
  let windowSum = 0;

  if (slots.length < windowSize) {
    return res.status(400).json({
      error: "Not enough data to calculate the requested charging window."
    });
  }

  for (let i = 0; i < windowSize; i++) {
    windowSum += slots[i].clean;
  }

  let maxSum = windowSum;
  let maxSumStartIndex = 0;

  for (let i = windowSize; i < slots.length; i++) {
    windowSum += slots[i].clean - slots[i - windowSize].clean;
    
    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxSumStartIndex = i - windowSize + 1;
    }
  }

  const best = {
    start: slots[maxSumStartIndex].from,
    end: slots[maxSumStartIndex + windowSize - 1].to,
    averageCleanPercentage: Number((maxSum / windowSize).toFixed(2))
  };
  
  res.json(best);
});