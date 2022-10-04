import { Routes } from "../classes/Routes";
import { ProcessEnv } from "../classes/ProcessEnv";

const test_env = Object.freeze({
    VITE_TARGET_USER: "client",
    VITE_HTML_PROTOCOL: "http",
    VITE_API_PREFIX: "api",
    VITE_TARGET_HOST: 'localhost',
    VITE_TARGET_PORT: '8000',
    VITE_EVENT_RESOURCE: 'event',
    VITE_USER_RESOURCE: 'user',
    VITE_STYLE_RESOURCE: 'style'
});

describe("Testing API Routes Path Generator", ()=> {

   test("Path Generator Event for CLIENT",()=>{
        const myEnv = new ProcessEnv(test_env);
        const myLoc = new URL("http://localhost:8000/board/JTP");
        const API = new Routes(myEnv, myLoc);

        expect(API.event.toString()).toBe("http://localhost:8000/api/event/JTP");
    })
   
    test("Path Generator Event for CLIENT",()=>{
        const myEnv = new ProcessEnv(test_env);
        const myLoc = new URL("http://localhost:8000/board/samuel");
        const API = new Routes(myEnv, myLoc);

        expect(API.event.toString()).toBe("http://localhost:8000/api/event");
    })
})