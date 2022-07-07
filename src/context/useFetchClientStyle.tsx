import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "../static/apiRoutes";

// This file exports one context that brings styles from API
export { useClientsStyles, ClientsStyles };

// Types From API: those are determined by the PHP server
type ClientsFromAPI = Array<string>;
type StylesFromAPI = Record<string, { primary: string; secondary: string }>;
type ResponseFromAPI = {
  clients: ClientsFromAPI;
  styles: StylesFromAPI;
  success: boolean;
};

const ClientsStyle = createContext<ResponseFromAPI | null>(null);
ClientsStyle.displayName = "Clients Style";
const useClientsStyles = () => useContext(ClientsStyle);

type ClientStyles = { children: JSX.Element };

function ClientsStyles(propTypes: ClientStyles) {
  const stylesData = useAddStyles("clients-styles", api.routes.styles);
  const clientsData = useAddStylesClientCSSlasses();

  const success = stylesData.success && clientsData.success;
  const clients = clientsData.clients;
  const styles = clientsData.styles;

  const ctx: ResponseFromAPI = { clients, styles, success };

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
      }).catch;
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
        id.current = setInterval(() => {
          handleFetch();
        }, 1000);
      }
    }, 100);

    return () => {
      isMount.current = false;
      id.current != null && clearInterval(id.current);
    };
  }, []);

  return { clients, styles, success };
}

//-------------------------------------------------------------------------------------
// This is purely side effect, it should always be used
function useAddStyles(name: string, path: string) {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    fetch(path)
      .then((res) => res.text())
      .then((styles) => {
        createStyles(name, styles);
        setSuccess(true);
      });

    return () => {
      deleteStyles(name);
    };
  }, []);

  return { success };
}

function createStyles(id: string, styles: string) {
  deleteStyles(id);

  const element = window.document.createElement("style");
  element.id = id;
  console.log(styles);
  element.innerText = styles.replace(/<br\s*\/?>/gi, " ");
  window.document.head.appendChild(element);
}
function deleteStyles(id: string) {
  const node = window.document.getElementById(id);
  if (node != null) {
    window.document.head.removeChild(node);
  }
}
