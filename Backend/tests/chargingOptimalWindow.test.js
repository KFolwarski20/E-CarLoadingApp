const request = require("supertest");
const express = require("express");

const axios = require("axios");

const chargingRouter = require("../routes/chargingOptimalWindowRoute");

jest.mock("axios");


const app = express();

app.use(express.json());
app.use("/api/charging/optimal-window", chargingRouter);


describe("POST /api/charging/optimal-window", () => {

    test("should return 400 when durationHours is missing", async () => {

        const response = await request(app)
            .post("/api/charging/optimal-window")
            .send({});

        expect(response.statusCode)
            .toBe(400);

        expect(response.body.error)
            .toBeDefined();
    });

    test("should reject durationHours not Integer", async()=>{

        const response = await request(app)
            .post("/api/charging/optimal-window")
            .send({
                durationHours:3.5
            });
    
        expect(response.statusCode)
            .toBe(400);
    });

    test("should reject durationHours above 6", async()=>{

        const response = await request(app)
            .post("/api/charging/optimal-window")
            .send({
                durationHours:7
            });
    
        expect(response.statusCode)
            .toBe(400);
    });

    test("should reject negative durationHours", async()=>{

        const response = await request(app)
            .post("/api/charging/optimal-window")
            .send({
                durationHours:-1
            });
    
        expect(response.statusCode)
            .toBe(400);
    });

    test("should return 400 when durationHours is not integer", async () => {

        const response = await request(app)
            .post("/api/charging/optimal-window")
            .send({
                durationHours: 2.5
            });

        expect(response.statusCode)
            .toBe(400);
    });

    test("should calculate optimal window", async () => {

        axios.get.mockResolvedValue({
            data: {
                data: [
                    {
                        from: "2026-07-22T10:00:00+01:00",
                        to: "2026-07-22T10:30:00+01:00",
                        generationmix:[
                            {
                                fuel:"wind",
                                perc:70
                            },
                            {
                                fuel:"solar",
                                perc:20
                            }
                        ]
                    },
                    {
                        from:"2026-07-22T10:30:00+01:00",
                        to:"2026-07-22T11:00:00+01:00",
                        generationmix:[
                            {
                                fuel:"wind",
                                perc:60
                            },
                            {
                                fuel:"solar",
                                perc:30
                            }
                        ]
                    }
                ]
            }
        });

        const response = await request(app)
            .post("/api/charging/optimal-window")
            .send({
                durationHours:1
            });

        expect(response.statusCode)
            .toBe(200);

        expect(response.body)
            .toHaveProperty("start");

        expect(response.body)
            .toHaveProperty("end");

        expect(response.body)
            .toHaveProperty("averageCleanPercentage");
    });
});