import { nullEvent } from "@/interfaces";

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
        const response = await window.fetch(this.routes.create(this.ENV_API_ENDPOINT_NAME)); 
        const list = await response.json();
        return list.data;
    }

    public async create(event: jh.event) : Promise<jh.event>
    {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer 7|AqGQZPjyX6qe62NtWgkFgKi44OP7vBeimCsWU406");
        
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
           const response = await window.fetch(this.routes.create(this.ENV_API_ENDPOINT_NAME), requestOptions);
           return await response.json();
        }

        catch (error)
        {
            return new Promise <jh.event> (resolve => resolve(nullEvent()))
        }
    }
}

class Routes
{
    private readonly domain = import.meta.env.MODE === "development" ? "http://localhost:8000" : "";
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