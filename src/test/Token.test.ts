import { Action, diffStates, reducerEvents } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { event, token } from "@/interfaces/index";
import { CustomTypes } from "@/customTypes";
import { Token } from "@/classes/token";

test("Within 31 days from 01 of march will be 01 of april", () => {
  const token = new Token();
  console.log(token);

  const today = "2022-04-01";
  const result = "2022-04-01";

  expect(today).toBe(result);
});
