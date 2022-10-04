import { ProcessEnv } from "./ProcessEnv";

export class Routes implements jh.Routes {
    private readonly m_env: ProcessEnv;
    readonly event: string;
    readonly user: string;
    readonly style: string;

    constructor(env: ProcessEnv, location: URL)
    {
        this.m_env = env;
        this.event = (new URL(env.api.event.toString() + this.build_USER_URL(location.toString()))).toString();
        this.user = env.api.user.toString();
        this.style = env.api.style.toString()
    }

    private build_USER_URL(location:string):string
    {
        const options = {master: "", client: `/${this.read_USER(location)}`.toUpperCase() };
        return options[this.m_env.user];
    }

    private read_USER(location:string)
    {
        return location.split("/").at(-1) ?? 'Guest';
    }
}

//const myEnv = new ProcessEnv(import.meta.env);
//const myLoc = window.location;

//export const API = new Routes(myEnv, myLoc);

//const routes = "backend/routes";
//const pathGenerator = (point: string, ext = "api.php") =>
//  `${domain}/${routes}/${point}.${ext}`;
//
//const pathGenerator_v2 = (point: string, prefix = "api") =>
//  `${domain}/${prefix}/${point}`;
//
//  export const api = {
//  routes: {
//    login: pathGenerator("login"),
//    events: pathGenerator_v2("event"),
//    clients: pathGenerator_v2("styles"), //TODO: [moved] client_styles -> styles
//    backoffice: {
//      styles: pathGenerator("backoffice/styles"),
//      addUser: pathGenerator("backoffice/addUser"),
//    },
//  },
//};
