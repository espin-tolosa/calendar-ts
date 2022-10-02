import { apiRoutes } from "@/static/apiRoutes";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { report } from "../logger/report";

// This file exports one context that brings styles from API
export { useClientsStyles, ClientsStyles };

const ClientsStyle = createContext<jh.response.maybe<jh.response.styles>>({
  success: false,
});

ClientsStyle.displayName = "Clients Style";
const useClientsStyles = () => useContext(ClientsStyle);

function ClientsStyles(propTypes: { children: JSX.Element })
{
    const clientsData = useAddStylesClientCSSlasses();

    const success = clientsData.success;
    const clients = clientsData.clients;
    const styles = clientsData.styles;

    const ctx: jh.response.maybe<jh.response.styles> = {
        success,
        response: { clients, colors: styles, update: clientsData.setStyles },
    };

    return (
        <ClientsStyle.Provider value={ctx}>
            {propTypes.children}
        </ClientsStyle.Provider>
    );
}

function useAddStylesClientCSSlasses()
{
    const isMount = useRef(true);
    const id = useRef<NodeJS.Timer | null>(null);
    const [success, setSuccess] = useState(false);
    const [clients, setClients] = useState<Array<string>>([]);
    const [styles, setStyles] = useState<jh.response.colors>({
        default: { primary: "", secondary: "" },
    });

    const css = useRef(false);

    if (!css.current)
    {
        css.current = true;
    }

    const handleFetch = () =>
    {
        //TODO fetch: check old end point api.routes.clients and change by proper apiRoutes
        fetch(apiRoutes.style.toString())
        .then((res) => res.json())
        .then((json: jh.response.colors) =>
        {
            if (!isMount.current)
            {
                return;
            }

            setClients(Object.keys(json));
            setStyles(json);
            setSuccess(true);
            id.current != null && clearInterval(id.current);
        })
        .catch((error) =>
        {
            report("local", error);
        });
    };

  //TODO: Change Refetch interval by a refetch if fails
  // There is a bug in the code that causes multiple request to the same resource until one of them each succeed.
  // It happens because there is an unkonwn delay between server and client communication.
  // As I wanted is to refetch multiple times if connection fails, this is what I have to implement, instead of set an interval
  const REFETCH_INTERVAL = 500; // ms

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
    }, REFETCH_INTERVAL);

    return () => {
      isMount.current = false;
      id.current != null && clearInterval(id.current);
    };
  }, []);

  return { clients, styles, success, setStyles };
}
