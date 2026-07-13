const request = require("supertest");
const express = require("express");
const axios = require("axios");

const energyRouter = require("../routes/energyMixRoute");

jest.mock("axios");

const app = express();

app.use("/api/energy/mix", energyRouter);

describe("GET /api/energy/mix",()=>{

    test("should return energy mix", async()=>{

        axios.get.mockResolvedValue({

        data:{
        data:[
        {
        from:"2026-07-13T00:00:00+01:00",
        generationmix:[
        {
        fuel:"wind",
        perc:50
        },
        {
        fuel:"solar",
        perc:20
        }
        ]
        }
        ]
        }

        });


    const response = await request(app)
    .get("/api/energy/mix");

    expect(response.statusCode)
    .toBe(200);

    expect(response.body)
    .toHaveProperty("2026-07-13");

    });
});