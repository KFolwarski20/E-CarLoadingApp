const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/energy/mix", require("./routes/energyMixRoute"));
app.use("/api/charging/optimal-window", require("./routes/chargingOptimalWindowRoute"));
app.use(errorHandler)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
