import { nullEvent } from "../interfaces";
import { apiRoutes } from "../static/apiRoutes";

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
        return this.pushEventRequest(event,"POST");
    }

    public async update(event: jh.event)
    {
        return this.pushEventRequest(event, "PUT");
    }

    private async pushEventRequest(event: jh.event, method: "POST" | "PUT") : Promise<jh.event>
    {
        const payload = {client: event.client, job: event.job, start: event.start, end: event.end};

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        const body = new URLSearchParams(payload);

        const requestOptions = {method, headers, body};

        try
        {
            //TODO fetch: check what does this and change by proper apiRoutes endpoint
            const putURI = `/${event.id}`
            const postURI = "";
            const url = this.routes.create(this.ENV_API_ENDPOINT_NAME) + (method === "PUT" ? putURI : postURI);
            const response = await window.fetch(url, requestOptions);
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
    //private readonly domain = import.meta.env.MODE === "localhost" ? "http://localhost:8000" : "";
    private readonly domain = "http://localhost:8000"

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