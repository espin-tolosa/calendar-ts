import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "../static/apiRoutes";
import { report } from "../logger/report";

// This file exports one context that brings styles from API
export { useClientsStyles, ClientsStyles };

const ClientsStyle = createContext<Maybe<ResponseFromAPI>>({ success: false });
ClientsStyle.displayName = "Clients Style";
const useClientsStyles = () => useContext(ClientsStyle);

type ClientStyles = { children: JSX.Element };

function ClientsStyles(propTypes: ClientStyles) {
  const clientsData = useAddStylesClientCSSlasses();

  const success = clientsData.success;
  const clients = clientsData.clients;
  const styles = clientsData.styles;

  const ctx: Maybe<ResponseFromAPI> = {
    success,
    response: { clients, styles },
  };

  return (
    <ClientsStyle.Provider value={ctx}>
      {propTypes.children}
    </ClientsStyle.Provider>
  );
}

function useAddStylesClientCSSlasses() {
  const isMount = useRef(true);
  const id = useRef<NodeJS.Timer | null>(null);
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<Array<string>>([]);
  const [styles, setStyles] = useState<StylesFromAPI>({
    default: { primary: "", secondary: "" },
  });

  const css = useRef(false);
  if (!css.current) {
    css.current = true;
  }

  const handleFetch = () => {
    fetch(api.routes.clients)
      .then((res) => res.json())
      .then((json: StylesFromAPI) => {
        if (!isMount.current) {
          return;
        }

        setClients(Object.keys(json));
        setStyles(json);
        setSuccess(true);
        id.current != null && clearInterval(id.current);
      })
      .catch((error) => {
        report("local", error);
      });
  };

  useEffect(() => {
    isMount.current = true;

    const MAX_ATTEMPS = 9;
    let attemps = 0;
    id.current = setInterval(() => {
      handleFetch();
      attemps += 1;
      if (attemps > MAX_ATTEMPS) {
        id.current != null && clearInterval(id.current);
        //  id.current = setInterval(() => {
        //    handleFetch();
        //  }, 1000);
      }
    }, 100);

    return () => {
      isMount.current = false;
      id.current != null && clearInterval(id.current);
    };
  }, []);

  return { clients, styles, success };
}
