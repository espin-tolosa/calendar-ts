import { nullEvent } from "../interfaces";
import { apiRoutes } from "../static/apiRoutes";
import { ProcessEnv } from "./ProcessEnv";

export class FetchEvent
{    
    private readonly ENV_API_ENDPOINT_NAME = 'event';
    private readonly routes;
    public static instance()
    {
        return new FetchEvent();
    }

    public constructor(routes: Routes = Routes.instance())
    {
        this.routes = routes;
    }

    public async all() : Promise<jh.event[]>
    {
        const response = await window.fetch( apiRoutes.event );

        let result: {data: jh.event[]} = {data: []}
        try
        {
            result = await response.json();
            return result.data ?? [];
        }

        catch(error)
        {
            const response = await window.fetch( apiRoutes.event ); 
            const result = await response.text();

            console.log("error on fetch all", result)
            return [];
        }
    }

    public async create(event: jh.event) : Promise<jh.event>
    {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        
        const formdata = new FormData();
        formdata.append("client", event.client );
        formdata.append("job", event.job);
        formdata.append("start", event.start);
        formdata.append("end", event.end);
        
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
        };

        try
        {
            //TODO fetch: check what does this and change by proper apiRoutes endpoint
           const response = await window.fetch(this.routes.create(this.ENV_API_ENDPOINT_NAME), requestOptions);
           return await response.json();
        }

        catch (error)
        {
            return new Promise <jh.event> (resolve => resolve(nullEvent()))
        }
    }
}
//TODO: substitute api.routes
class Routes
{
    private readonly domain = import.meta.env.MODE === "localhost" ? "http://localhost:8000" : "";

    private prefix = 'api';

    public create(resource: string)
    {
        return `${this.domain}/${this.prefix}/${resource}`;
    }
    
    public static instance()
    {
        return new Routes();
    }
}