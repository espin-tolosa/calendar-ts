import { ProcessEnv } from "../classes/ProcessEnv";

const test_env : jh.EnvDefault = Object.freeze({
    VITE_TARGET_USER: "client",
    VITE_HTML_PROTOCOL: "http",
    VITE_API_PREFIX: "api",
    VITE_TARGET_HOST: 'localhost',
    VITE_TARGET_PORT: '8000',
    VITE_EVENT_RESOURCE: 'event',
    VITE_USER_RESOURCE: 'user',
    VITE_STYLE_RESOURCE: 'style'
});

describe("Testing env methods", ()=>{

    test("Get the route for event resource", ()=>{
        const myEnv = new ProcessEnv(test_env)
        expect(myEnv.api.event.toString()).toBe("http://localhost:8000/api/event")
    });
    test("Get the route for user resource", ()=>{
        const myEnv = new ProcessEnv(test_env)
        expect(myEnv.api.user.toString()).toBe("http://localhost:8000/api/user")
    });
    test("Get the route for style resource", ()=>{
        const myEnv = new ProcessEnv(test_env)
        expect(myEnv.api.style.toString()).toBe("http://localhost:8000/api/style")
    });
});