//type EnvObj = Record<string,string>;

/**
 * Process Env file to build useful data,
 * only public members exposes whata data is available after processing env file
 */
export class ProcessEnv {
    /**
     * By design: all .env values has to be registered here with a corresponding default value, in order to work
     */
    private readonly EnvDefault : jh.EnvDefault = {
        'VITE_HTML_PROTOCOL' : 'http',
        'VITE_TARGET_HOST' : 'localhost',
        'VITE_TARGET_PORT' : '8000',
        'VITE_API_PREFIX' : 'api',
        'VITE_EVENT_RESOURCE' : 'event',
        'VITE_USER_RESOURCE' : 'user',
        'VITE_STYLE_RESOURCE' : 'style'
    }

    /**
     * Exposes a public interface with all routes read from .env
     */
    public readonly api: jh.Routes;
    /**
     * User Type
     */
    public readonly user: 'master' | 'client';

    /**
     * Stores environmental variables taken from .env file
     */
    private readonly m_env: jh.EnvDefault;

    private readonly host: string;

    constructor(env: jh.EnvDefault)
    {
        this.m_env = env;

        this.user = 'client';

        this.host = this.build_ROOT_URL('VITE_HTML_PROTOCOL', 'VITE_TARGET_HOST', 'VITE_TARGET_PORT');
        
        this.api = Object.freeze<jh.Routes>({
            user :  (new URL(this.host + this.build_API_ENDPOINT('VITE_API_PREFIX', 'VITE_USER_RESOURCE'))).toString(),
            event:  (new URL(this.host + this.build_API_ENDPOINT('VITE_API_PREFIX', 'VITE_EVENT_RESOURCE'))).toString(),
            style:  (new URL(this.host + this.build_API_ENDPOINT('VITE_API_PREFIX', 'VITE_STYLE_RESOURCE'))).toString()
        })
    }

    private build_ROOT_URL(protocol: keyof jh.EnvDefault ,host: keyof jh.EnvDefault,port: keyof jh.EnvDefault):string
    {
        return `${this.get(protocol, this.EnvDefault.VITE_HTML_PROTOCOL)}://${this.get(host,this.EnvDefault.VITE_TARGET_HOST)}:${this.get(port,this.EnvDefault.VITE_TARGET_PORT)}`;
    }

    private build_API_ENDPOINT(prefix: keyof jh.EnvDefault, resource: keyof jh.EnvDefault):string
    {
        return `/${this.get(prefix, this.EnvDefault.VITE_API_PREFIX)}/${this.get(resource,'')}`;
    }

    private get(key: keyof jh.EnvDefault , alternative:string):string
    {
        const keyIsNotRegistered = Object.keys(this.EnvDefault).every(registerKey => key !== registerKey);

        if ( keyIsNotRegistered )
        {
            console.error(`Class ProcessEnv expects key: ${key} but it wasn't provided, related end points will fail`)
            return '';
        }

        return this.m_env[key] ? this.m_env[key] : this.callAlternativeValue(key, alternative);
    }

    private callAlternativeValue(key:string, alternative:string)
    {
        console.warn(`Some expected value is not given in .env file, for key: ${key}, default value will be taken`);
        return alternative;
    }

    //private whichUser(options:{master:string,client:string}):string
    //{
    //    const alternative = 'client'
    //    const USER = this.get('VITE_TARGET_USER', alternative);
    //    if(USER !== 'client' &&  USER !== 'master')
    //    {
    //        return this.callAlternativeValue(USER, alternative);
    //    }

    //    return options[USER];
    //}

    //private build_USER_URL(location:string):string
    //{
    //    const options = {master: "", client: `/${this.read_USER(location)}`.toUpperCase() };
    //    return this.whichUser(options);
    //}

    //private read_USER(location:string)
    //{
    //    return location.split("/").at(-1) ?? 'Guest';
    //}
}
//const myEnv = new ProcessEnv(import.meta.env)

//myEnv.event = new URL("")