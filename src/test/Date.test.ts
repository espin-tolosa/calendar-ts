import { DateService } from "../utils/Date";

test("Within 31 days from 01 of march will be 01 of april", () => {
  const today = "2022-03-01";
  const result = "2022-04-01";

  expect(result).toBe(DateService.GetDateFrom(today, 31));
});
test("Today is 2022-03-01 and yesterday was 2022-02-28", () => {
  const today = "2022-03-01";
  const result = "2022-02-28";

  expect(result).toBe(DateService.GetDateFrom(today, -1));
});
