import { composition } from "../interfaces";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/static/apiRoutes";

type ClientsStyle = Array<string>;
type StylesFromAPI = Record<string, { primary: string; secondary: string }>;
type Context = {
  clients: ClientsStyle;
  styles: StylesFromAPI;
  success: boolean;
} | null;

const ClientsStyle = createContext<Context>(null);
ClientsStyle.displayName = "Clients Style";

export const useClientsStyles = () => useContext(ClientsStyle);
export const ClientsStyles: composition = (propTypes) => {
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<Array<string>>([]);
  const [styles, setStyles] = useState<StylesFromAPI>({
    default: { primary: "", secondary: "" },
  });

  useEffect(() => {
    setSuccess(false);
    fetch(api.routes.styles);
    fetch(api.routes.clients)
      .then((res) => res.json())
      .then((json: StylesFromAPI) => {
        setClients(Object.keys(json));
        setStyles(json);
        setSuccess(true);
      });
  }, []);

  return (
    <ClientsStyle.Provider value={{ clients, styles, success }}>
      {propTypes.children}
    </ClientsStyle.Provider>
  );
};
