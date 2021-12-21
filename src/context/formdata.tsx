/*
import { createContext, useContext } from "react";

interface iForm {
  client: string;
  job: string;
  start: string;
  end: string;
  update: Function;
}

const initState = {
  client: "",
  job: "",
  start: "",
  end: "",
  update: () => {
    console.log("update not set jet");
  },
};

export const FormDataContext = createContext<iForm>(initState);

export const useFormDataContext = () => useContext(FormDataContext);
*/
import { useState, createContext } from "react";

//type SetValue = (value: string) => void;
type SetValue = React.Dispatch<React.SetStateAction<string>>;
interface AppContextInterface {
  client: string;
  setClient: SetValue;
  job: string;
  setJob: SetValue;
}
interface AppContextInterfaceDates {
  start: string;
  end: string;
}
interface AppContextInterfaceSetDates {
  setStart: SetValue;
  setEnd: SetValue;
}

const initValue = {
  client: "",
  setClient: () => {},
  job: "",
  setJob: () => {},
};
const initDateValue = {
  start: "",
  end: "",
};
const initSetDateValue = {
  setStart: () => {},
  setEnd: () => {},
};
export const SimpleCtx = createContext<AppContextInterface>(initValue);
export const DatesCtx = createContext<AppContextInterfaceDates>(initDateValue);
export const SetDatesCtx =
  createContext<AppContextInterfaceSetDates>(initSetDateValue);

export const CtxProvider: React.FC = (props) => {
  const [client, setClient] = useState("");
  const [job, setJob] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  return (
    <SimpleCtx.Provider
      value={{
        client,
        setClient,
        job,
        setJob,
      }}
    >
      <SetDatesCtx.Provider value={{ setStart, setEnd }}>
        <DatesCtx.Provider value={{ start, end }}>
          {props.children}
        </DatesCtx.Provider>
      </SetDatesCtx.Provider>
    </SimpleCtx.Provider>
  );
};
