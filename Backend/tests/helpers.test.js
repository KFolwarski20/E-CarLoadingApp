const {
    groupByDay,
    calculateDailyAverages,
    calculateCleanPercentage
} = require("../utils/helpers");


describe("groupByDay",()=>{

    test("should group slots by date",()=>{

        const data = [
            {
                from: "2026-07-13T00:00:00+01:00",
                generationmix: []
            },
            {
                from: "2026-07-13T23:30:00+01:00",
                generationmix: []
            },
            {
                from: "2026-07-14T00:30:00+01:00",
                generationmix: []
            },
            {
                from: "2026-07-15T00:00:00+01:00",
                generationmix: []
            },
            {
                from: "2026-07-14T12:00:00+01:00",
                generationmix: []
            }
        ];

        const result = groupByDay(data);

        expect(Object.keys(result)).toHaveLength(3);

        expect(result["2026-07-13"]).toHaveLength(2);

        expect(result["2026-07-14"]).toHaveLength(2);

        expect(result["2026-07-15"]).toHaveLength(1);
    });
});

describe("calculateDailyAverages", () => {

    test("should calculate average energy mix", () => {

        const dayData = [
            {
                generationmix: [
                    {
                        fuel: "wind",
                        perc: 9.3
                    },
                    {
                        fuel: "solar",
                        perc: 5.4
                    },
                    {
                        fuel: "gas",
                        perc: 3.5
                    }
                ]
            },
            {
                generationmix: [
                    {
                        fuel: "wind",
                        perc: 11.72
                    },
                    {
                        fuel: "solar",
                        perc: 4.6
                    },
                    {
                        fuel: "gas",
                        perc: 30
                    }
                ]
            }
        ];

        const result = calculateDailyAverages(dayData);

        expect(result.mix.wind)
            .toBe(10.51);

        expect(result.mix.solar)
            .toBe(5);

        expect(result.mix.gas)
            .toBe(16.75);

        expect(result.cleanPercentage)
            .toBe("15.51");
    });
});

describe("calculateCleanPercentage",()=>{

    test("calculates clean energy percentage only for influencial factors",()=>{

        const generationmix = [
            {
                fuel:"biomass",
                perc:10
            },
            {
                fuel:"nuclear",
                perc:20
            },
            {
                fuel:"hydro",
                perc:30
            },
            {
                fuel:"wind",
                perc: 5
            },
            {
                fuel:"solar",
                perc: 3
            }
        ];

        const result = calculateCleanPercentage(
            generationmix
        );

        expect(result)
            .toBe(68);
    });

    test("calculates clean energy percentage for different factors",()=>{

        const generationmix = [
            {
                fuel:"biomass",
                perc:10
            },
            {
                fuel:"gas",
                perc:20
            },
            {
                fuel:"hydro",
                perc:30
            },
            {
                fuel:"imports",
                perc: 5
            },
            {
                fuel:"solar",
                perc: 3
            }
        ];

        const result = calculateCleanPercentage(
            generationmix
        );

        expect(result)
            .toBe(43);
    });
});