const request = require("supertest");
const express = require("express");

jest.mock("../services/ExternalApiService");

const {
    getGenerationData
} = require("../services/ExternalApiService");

const energyRouter = require("../routes/energyMixRoute");
const errorHandler = require("../middleware/errorHandler");

const app = express();

app.use(express.json());
app.use("/api/energy/mix", energyRouter);
app.use(errorHandler);


test("should handle external API error", async()=>{

    getGenerationData.mockRejectedValue(
        new Error("External API failed")
    );

    const response = await request(app)
        .get("/api/energy/mix");

    expect(response.statusCode)
        .toBe(500);

    expect(response.body.message)
        .toBe("External API failed");
});