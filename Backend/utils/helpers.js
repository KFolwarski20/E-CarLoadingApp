const CLEAN_SOURCES = ["biomass", "nuclear", "hydro", "wind", "solar"]

function groupByDay(data) {
    const grouped = {};

    data.forEach(entry => {
        const day = entry.from.split("T")[0];

        if(!grouped[day]) grouped[day] = [];
        grouped[day].push(entry);
    });

    return grouped;
}

function calculateDailyAverages(dayData) {
    const totals = {};
    const count = dayData.length;

    dayData.forEach(entry => {
        entry.generationmix.forEach(fuel => {
            if (!totals[fuel.fuel]) totals[fuel.fuel] = 0;
            totals[fuel.fuel] += fuel.perc;
        });
    });

    const averages = {};
    for (let fuel in totals) {
        averages[fuel] = Number((totals[fuel] / count).toFixed(2));
    }

    const clean = CLEAN_SOURCES.reduce(
        (sum, src) => sum + (averages[src] || 0),
        0
    );

    return {
        mix: averages,
        cleanPercentage: clean.toFixed(2)
    };
}

const calculateCleanPercentage = (generationmix) => {
    const sum = generationmix
      .filter(f => CLEAN_SOURCES.includes(f.fuel))
      .reduce((acc, f) => acc + f.perc, 0);
  
    return Number(sum.toFixed(1));
  };

module.exports = {
    groupByDay,
    calculateDailyAverages,
    calculateCleanPercentage
};