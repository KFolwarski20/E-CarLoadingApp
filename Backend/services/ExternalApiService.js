const axios = require("axios");
const dayjs = require("../utils/dayjs")

const getGenerationData = async (startDay, days) => {
    
    const startUK = dayjs()
        .tz("Europe/London")
        .startOf("day")
        .add(startDay, "day");

    const endUK = startUK.add(days, "day");

    const from = startUK.toISOString(); 
    const to = endUK.toISOString();
  
    const response = await axios.get(
        `https://api.carbonintensity.org.uk/generation/${from}/${to}`
    );

    return response.data.data
        .filter(item => {
            const timeUK = dayjs(item.from)
                .tz("Europe/London");

            return timeUK.isBetween(
                startUK,
                endUK,
                null,
                "[)"
            );
        })
        .map(item => ({
            ...item,
            from: dayjs(item.from)
                .tz("Europe/London")
                .format("YYYY-MM-DDTHH:mm:ssZ"),

            to: dayjs(item.to)
                .tz("Europe/London")
                .format("YYYY-MM-DDTHH:mm:ssZ")
        }));
};

module.exports = {
    getGenerationData
}