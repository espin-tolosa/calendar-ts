import { GetTodayDateFormat } from "./DateService"

describe("Testing Date Service Shared Utility", ()=>{

    test("Get Today Date Format", ()=>{
        expect(GetTodayDateFormat(new Date("2022-01-01"))).toBe("Saturday 1 January 2022");
        expect(GetTodayDateFormat(new Date("2022-10-04"))).toBe("Tuesday 4 October 2022");
        expect(GetTodayDateFormat(new Date("2024-02-29"))).toBe("Thursday 29 February 2024");
    })
})
