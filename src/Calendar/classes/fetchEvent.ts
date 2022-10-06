import { nullEvent } from "../interfaces";
import { apiRoutes } from "../static/apiRoutes";
import { ProcessEnv } from "./ProcessEnv";

export class FetchEvent
{    
    private readonly m_routes;
    public static instance()
    {
        return new FetchEvent();
    }

    public constructor(routes = Routes.event())
    {
        this.m_routes = routes;
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

    public async destroy(event: jh.event)
    {
        return this.pushEventRequest(event, "DELETE");
    }

    private async pushEventRequest(event: jh.event, method: "POST" | "PUT" | "DELETE") : Promise<jh.event>
    {
        //TODO: payload must be typed, with values expected in Laravel
        const payload = {client: event.client, job: event.job, start: event.start, end: event.end, done: String(event.done)};

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
            const url = this.m_routes + (method === "PUT" || method === "DELETE" ? putURI : postURI);
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
    public static event()
    {
        const myEnv =  new ProcessEnv(import.meta.env);
        return myEnv.api.event;
    }
    public static user()
    {
        const myEnv =  new ProcessEnv(import.meta.env);
        return myEnv.api.user;
    }
    public static style()
    {
        const myEnv =  new ProcessEnv(import.meta.env);
        return myEnv.api.style;
    }
}