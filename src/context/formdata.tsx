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
import * as React from "react";

//type SetValue = (value: string) => void;
type SetValue = React.Dispatch<React.SetStateAction<string>>;
interface AppContextInterface {
  client: string;
  setClient: SetValue;
  job: string;
  setJob: SetValue;
}

const initValue = {
  client: "",
  setClient: () => {},
  job: "",
  setJob: () => {},
};
export const SimpleCtx = React.createContext<AppContextInterface>(initValue);

export const CtxProvider: React.FC = (props) => {
  const [client, setClient] = React.useState("");
  const [job, setJob] = React.useState("");
  return (
    <SimpleCtx.Provider
      value={{
        client,
        setClient,
        job,
        setJob,
      }}
    >
      {props.children}
    </SimpleCtx.Provider>
  );
};
