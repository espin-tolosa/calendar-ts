import { DateService, DayWeek } from '../utils/Date';
import {describe, expect, test} from '@jest/globals';

describe('sum module', () =>
{
    test.skip('adds 1 + 2 to equal 3', () => { 
        expect(DateService.GetDateNextDay("2022-09-01", DayWeek.Monday)).toBe("2022-09-05");
        expect(DateService.GetDateNextDay("2022-09-01", DayWeek.Tuesday)).toBe("2022-09-06");
        expect(DateService.GetDateNextDay("2022-09-01", DayWeek.Wednesday)).toBe("2022-09-07");
        expect(DateService.GetDateNextDay("2022-09-01", DayWeek.Thursday)).toBe("2022-09-08");
        expect(DateService.GetDateNextDay("2022-09-01", DayWeek.Friday)).toBe("2022-09-02");
        expect(DateService.GetDateNextDay("2022-09-01", DayWeek.Saturday)).toBe("2022-09-03");
        expect(DateService.GetDateNextDay("2022-09-01", DayWeek.Sunday)).toBe("2022-09-04");
  });
});