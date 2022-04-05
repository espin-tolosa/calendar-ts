import { Action, diffStates, reducerEvents } from "@/hooks/useEventsState";
import { DateService } from "@/utils/Date";
import { event } from "@/interfaces/index";
import { CustomTypes } from "@/customTypes";

const genEventCall = (
  type: CustomTypes.DispatchLocalStateEvents,
  id: number,
  client: string,
  job: string,
  start: string,
  end: string
) => {
  //return empty state if no event data is provided

  const payload = [
    {
      id,
      client,
      job,
      start,
      end,
    },
  ];
  return { type, payload } as Action;
};

const emptyState: Array<event> = [];
const state1Event: Array<event> = reducerEvents(
  emptyState,
  genEventCall("syncDB", 1, "Client_1", "Job_1", "2022-03-01", "2022-03-10")
);
const state2Event = reducerEvents(
  state1Event,
  genEventCall("syncDB", 2, "Client_1", "Job_1", "2022-03-01", "2022-03-10")
);

const expectToBe = (input: event, output: event) => {
  expect(input.id).toBe(output.id);
  expect(input.client).toBe(output.client);
  expect(input.job).toBe(output.job);
  expect(input.start).toBe(output.start);
  expect(input.end).toBe(output.end);
};

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

test("append one day duration is represented by one entry in the local state", () => {
  const state: Array<event> = [];
  const action = genEventCall(
    "syncDB",
    1,
    "client1",
    "testjob",
    "2022-03-01",
    "2022-03-01"
  );
  const newState = reducerEvents(state, action);
  expect(newState.length).toBe(1);
  expectToBe(newState[0], action.payload[0]);
});

test("append two day duration is represented by two entry in the local state", () => {
  const state: Array<event> = [];
  const action = genEventCall(
    "syncDB",
    1,
    "client1",
    "testjob",
    "2022-03-01",
    "2022-03-02"
  );
  const newState = reducerEvents(state, action);
  expect(newState.length).toBe(2);
  expectToBe(newState[0], action.payload[0]);
  expectToBe(newState[1], {
    ...action.payload[0],
    id: -1,
    start: "2022-03-02",
  });
});

test("append one week duration is represented by 1+6 per week in local state", () => {
  const state: Array<event> = [];
  const action = genEventCall(
    "syncDB",
    1,
    "client1",
    "testjob",
    "2022-03-01",
    "2022-03-08"
  );
  const newState = reducerEvents(state, action);
  expect(newState.length).toBe(8);
  expectToBe(newState[6], {
    ...action.payload[0],
    job: "#isChildren",
    start: "2022-03-07",
    end: "2022-03-08",
  });
});

test("no append if end is before start", () => {
  const state: Array<event> = [];
  const action = genEventCall(
    "syncDB",
    1,
    "client1",
    "testjob",
    "2022-03-02",
    "2022-03-01"
  );
  const newState = reducerEvents(state, action);
  expect(newState.length).toBe(0);
});

test("replace by id a single day event", () => {
  const state: Array<event> = [
    {
      id: 1,
      client: "client2",
      job: "testjob2",
      start: "2022-03-04",
      end: "2022-03-04",
    },
  ];
  const action = genEventCall(
    "override",
    1,
    "client2",
    "testjob2",
    "2022-03-04",
    "2022-03-04"
  );
  const newState = reducerEvents(state, action);
  expect(newState.length).toBe(1);
  expectToBe(newState[0], action.payload[0]);
});
test("replace by id a multiple day event", () => {
  const action = genEventCall(
    "override",
    1,
    "client2",
    "testjob2",
    "2022-03-01",
    "2022-03-01"
  );

  const newState = reducerEvents(state1Event, action);
  expect(newState.length).toBe(state1Event.length - 9); //reduced the event in 9 days
  expectToBe(newState[0], action.payload[0]);
});

test("replace by id not found the id, the state wont change", () => {
  const action = genEventCall(
    "override", //<-testing this
    2,
    "client2",
    "testjob2",
    "2022-03-01",
    "2022-03-03"
  );
  const newState = reducerEvents(emptyState, action);
  expect(newState.length).toBe(0);
});

test("update event state from empty state", () => {
  const action = genEventCall(
    "update",
    2,
    "client2",
    "testjob2",
    "2022-03-01",
    "2022-03-03"
  );
  const newState = reducerEvents(emptyState, action);
  expect(newState.length).toBe(3);
});

test("dont update state for placeholder ids", () => {
  const action = genEventCall(
    "update",
    -1,
    "client2",
    "testjob2",
    "2022-03-01",
    "2022-03-12"
  );

  const newState = reducerEvents(state1Event, action);
  expect(newState.length).toBe(state1Event.length);
});

test("update state for nonexistent ids", () => {
  const action = genEventCall(
    "update",
    3,
    "client3",
    "testjob3",
    "2022-03-01",
    "2022-03-10"
  );

  const newState = reducerEvents(state2Event, action);
  expect(newState.length).toBe(state2Event.length + 10);
  expect(newState).toEqual(state2Event.concat(reducerEvents([], action)));
});

test("object are different references", () => {
  const action = genEventCall(
    "syncDB",
    2,
    "client1",
    "testjob1",
    "2022-03-01",
    "2022-03-10"
  );
  const newState = reducerEvents(state1Event, action);
  const isSame = Object.is(newState, state1Event);
  expect(isSame).toBe(false);
});
test("object are different references", () => {
  const action = genEventCall(
    "update",
    1,
    "client1",
    "testjob1",
    "2022-03-01",
    "2022-03-10"
  );
  const newState = reducerEvents(state1Event, action);
  const isSame = Object.is(newState, state1Event);
  expect(isSame).toBe(false);
});
test("object are different content", () => {
  const newState = reducerDemo(state1Event);

  //state is passed by ref
  function reducerDemo(state: Array<event>) {
    const newState = [...state];
    newState[0].id = 100;
    return newState;
  }

  expect(newState[0]).toBe(state1Event[0]);
  expect(newState).toEqual(state1Event);
});

test("Testing", () => {
  const state: Array<event> = [
    {
      id: 1,
      client: "Client_1",
      job: "Job",
      start: "2022-03-01",
      end: "2022-03-02",
    },
  ];
  const newState: Array<event> = [
    {
      id: 1,
      client: "Client_1",
      job: "new Job",
      start: "2022-03-02",
      end: "2022-03-02",
    },
    {
      id: 2,
      client: "Client_1",
      job: "Job",
      start: "2022-03-04",
      end: "2022-03-05",
    },
    {
      id: 3,
      client: "Client_1",
      job: "Job",
      start: "2022-03-10",
      end: "2022-03-15",
    },
  ];
});

//test("tessting returned references", () => {
//  const action = genEventCall(
//    "appendarray",
//    3,
//    "client3",
//    "testjob3",
//    "2022-03-01",
//    "2022-03-10"
//  );
//
//  const newState = reducerEvents(state2Event, action);
//
//
//  expect(newState).toBe(state2Event);
//});
