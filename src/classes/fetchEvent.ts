export class FetchEvent
{    
    private readonly ENV_API_ENDPOINT_NAME = 'event';
    public async all(routes: Routes = Routes.instance() ) : Promise<jh.event[]>
    {
        const response = await fetch(routes.create(this.ENV_API_ENDPOINT_NAME)); 
        const list = await response.json();
        return list.data;
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