import { EventCardDemo } from "../components/Event/eventCard";
import { useHoverEvent, useStyles } from "../components/Event/logic";
import { useClientsStyles } from "../context/useFetchClientStyle";
import { nullEvent } from "../interfaces";
import { createRef, useEffect, useRef, useState } from "react";
import { Color, SliderPicker } from "react-color";
import tw from "tailwind-styled-components/dist/tailwind";
import { TopBar } from "../components/TopBar/main";
import { Styles } from "../classes/styles";

const PasswordInput = tw.input<{ $error: boolean; $passmatch: boolean }>`
outline outline-2
${({ $error }: { $error: boolean }) =>
  ($error && "outline-red-900 focus:outline-red-900") ||
  "outline-transparent focus:outline-none"}
	
${({ $passmatch }: { $passmatch: boolean }) =>
  ($passmatch && "outline-green-500 focus:outline-2 focus:outline-green-500") ||
  ""}
`;

const Button = tw.button<{ $status: boolean }>`
border border-4 border-slate-200 rounded-full w-8 h-8 hover:bg-green-200 transition-colors text-transparent
${({ $status }: { $status: boolean }) =>
  ($status && "bg-blue-400 ") || "bg-red-400"}
`;

export function Settings() {
    const [reloadClients, setReloadClients] = useState(0);
    const [clients, setClients] = useState<jh.Hooks.ClientStyles>({success: false})
    const fetchClients = useClientsStyles();
    useEffect(()=>{
        setClients({...fetchClients});
    },[reloadClients, fetchClients]);

  const [input_ClientName, set_ClientName] = useState("");
  const [input_Password, set_Password] = useState("");
  const [input_RepeatPassword, set_RepeatPassword] = useState("");

  const [input_JobTitle, set_JobTitle] = useState("");
  const [input_JobType, set_JobType] = useState<"team"|"public"|"private"|"">("");
  
  const [formError, setFormError] = useState<string | boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string | boolean>(false);
  const [formWaiting, setFormWaiting] = useState<string | boolean>(false);

  const [input_ClientError, set_InputClientError] = useState(false);
  const [input_PasswordError, set_InputPasswordError] = useState(false);
  const [input_RepeatPassError, set_InputRepeatPassError] = useState(false);

  const [input_JobTitleError, set_InputJobTitleError] = useState(false);
  const [input_JobTypeError, set_InputJobTypeError] = useState(false);

  const input_ClientRef = useRef<HTMLInputElement>(null);
  const input_PasswordRef = useRef<HTMLInputElement>(null);
  const input_RepeatPasswordRef = useRef<HTMLInputElement>(null);

  return (
    <>
    <TopBar user={"james"} />
    
        <h1 className='mb-4 bg-slate-200 px-4 py-1 flex justify-center align-center font-bold' >
            Create a new Client
        </h1>
      <form className="flex gap-2 mx-4 mb-4" autoComplete="off" autoSave="off">
        <PasswordInput
          ref={input_ClientRef}
          $error={input_ClientError}
          $passmatch={input_ClientName !== ""}
          autoComplete="new-password"
          required={true}
          type="text"
          placeholder="Enter user name..."
          onChange={(e) => {
            setFormError(false);
            setFormSuccess(false);
            set_InputClientError(false);
            set_ClientName(e.currentTarget.value);
          }}
          value={input_ClientName}
        />
        <PasswordInput
          ref={input_PasswordRef}
          $error={input_PasswordError}
          $passmatch={
            !!input_Password && input_Password === input_RepeatPassword
          }
          required={true}
          autoComplete="new-password"
          type="password"
          placeholder="Enter a password..."
          onFocus={() => {
            if (formError) {
              set_Password("");
              set_RepeatPassword("");
              setFormError(false);
            }
          }}
          onChange={(e) => {
            setFormSuccess(false);
            setFormError(false);
            set_Password(e.currentTarget.value);
            set_InputPasswordError(false);
            set_InputRepeatPassError(false);
          }}
          value={input_Password}
        />

        <PasswordInput
          ref={input_RepeatPasswordRef}
          $error={input_RepeatPassError}
          $passmatch={
            !!input_RepeatPassword && input_Password === input_RepeatPassword
          }
          required={true}
          autoComplete="new-password"
          type="password"
          placeholder="Repeat the password..."
          onFocus={() => {
            if (formError) {
              setFormError(false);
            }
          }}
          onChange={(e) => {
            setFormSuccess(false);
            setFormError(false);
            set_RepeatPassword(e.currentTarget.value);
            set_InputPasswordError(false);
            set_InputRepeatPassError(false);
          }}
          value={input_RepeatPassword}
        />
        <Button
          $status={
            !input_ClientError && !input_PasswordError && !input_RepeatPassError
          }
          onClick={(e) => {
            e.preventDefault();
            //Check gor errors
            if (input_ClientName === "") {
              //TODO: better parsing using regex
              set_InputClientError(true);
            }
            if (input_Password === "") {
              //TODO: better parsing using regex
              set_Password("");
              set_InputPasswordError(true);
            }
            if (input_RepeatPassword === "") {
              //TODO: better parsing using regex
              set_RepeatPassword("");
              set_InputRepeatPassError(true);
            }
            if (
              input_ClientName === "" ||
              input_Password === "" ||
              input_RepeatPassword === ""
            ) {
              setFormSuccess(false);
              setFormError(
                "Please fill all fields: Name, Password and Password Repeat to create a new user safely"
              );
              if (input_ClientName === "") {
                input_ClientRef.current?.focus();
                return;
              }
              if (input_Password === "") {
                input_PasswordRef.current?.focus();
                return;
              }
              if (input_RepeatPassword === "") {
                input_RepeatPasswordRef.current?.focus();
                return;
              }
              return;
            }
            if (input_Password !== input_RepeatPassword) {
              setFormSuccess(false);
              set_InputPasswordError(true);
              set_InputRepeatPassError(true);
              setFormError("Password doesn't match");
              set_Password("");
              set_RepeatPassword("");
              return;
            }

            //TODO: instead of passing all setters to the function, make the function return a status an a message from the API and use .then to set this up from here
            setFormWaiting("Waiting request from server...");
            //</form>queryAddClient(input_ClientName, input_Password, input_RepeatPassword)
            queryAddClientStyle(input_ClientName, "client", "#aabbcc");
            queryAddUser(input_ClientName, "client", input_Password, input_RepeatPassword)
              .then((response) => {
                if (response.status === 201) {
                  setFormError(false);
                  set_ClientName("");
                  setFormSuccess(`Created new user: ${name}`);
                } else if (response.status === 403) {
                  setFormSuccess(false);
                  setFormError(`Error: user ${name} already exists`);
                } else if (response.status === 402) {
                  setFormSuccess(false);
                  setFormError(`Error: user ${name} already exists`);
                } else {
                  setFormSuccess(false);
                  setFormError(
                    `Error: something went wrong. If error persist contact with support staff`
                  );
                }
              })
              .catch(() => {
                setFormError("Error: bad connection to the server");
              })
              .finally(() => {
                setFormWaiting(false);
              });

            set_Password("");
            set_RepeatPassword("");
            set_InputPasswordError(false);
            set_InputRepeatPassError(false);
            setReloadClients(prev=>prev+1)
            setTimeout(()=>{
                window.location.reload();
            },2000)
          }}
        >
          +
        </Button>
      </form>
      {formError && <div className="text-red-900">{formError}</div>}
      {formSuccess && <div className="text-green-900">{formSuccess}</div>}
      {formWaiting && <div className="text-slate-500">{formWaiting}</div>}

{
    /**
     * FORM TO CREATE TEAM, PUBLIC OR PRIVATE EVENT
     */
}
        <h1 className='mb-4 bg-slate-200 px-4 py-1 flex justify-center align-center font-bold' >
            Create a Team, Public or Private Job
        </h1>
      <form className="flex gap-2 mx-4 mb-4" autoComplete="off" autoSave="off">
        <PasswordInput
          ref={input_ClientRef}
          $error={false}
          $passmatch={input_JobTitle !== ""}
          autoComplete="new-password"
          required={true}
          type="text"
          placeholder="Enter job title"
          onChange={(e) => {
            setFormError(false);
            setFormSuccess(false);
            set_JobTitle(e.currentTarget.value);
          }}
          value={input_JobTitle}
        />
        <select
          onChange={(e) => {
            setFormError(false);
            setFormSuccess(false);
            set_JobType(e.currentTarget.value.toLowerCase() as "team" | "private" | "public")
          }}
        >
            <option hidden>
                Select Group
            </option>
            <option>
                Team
            </option>
            <option>
                Public
            </option>
            <option>
                Private
            </option>
        </select>
        <Button
          $status={
            !input_ClientError && !input_PasswordError && !input_RepeatPassError
          }
          onClick={(e) => {
            e.preventDefault();
            //Check gor errors

            setFormWaiting("Waiting request from server...");
            //</form>queryAddClient(input_ClientName, input_Password, input_RepeatPassword)
            if(input_JobType !== "")
            {
                queryAddClientStyle(input_JobTitle, input_JobType, "#aabbcc").then(()=>{
                    setFormWaiting("");
                });
            }

            set_JobTitle("");
            set_JobType("");
            set_InputJobTitleError (false);
            set_InputJobTypeError(false);
            setReloadClients(prev=>prev+1)
            setTimeout(()=>{
                window.location.reload();
            },2000)
          }}
        >
          +
        </Button>
      </form>
      {formError && <div className="text-red-900">{formError}</div>}
      {formSuccess && <div className="text-green-900">{formSuccess}</div>}
      {formWaiting && <div className="text-slate-500">{formWaiting}</div>}
        
        <Styles.ClientEventList key={"clientevent"} list={{...clients}}/>
    </>
  );
}

export function EventDemoDescription({ name, description }: { name: string, description: string }) {
  const event: jh.event = {...nullEvent(), client: name, job: description};

  return <EventDemo event={event}></EventDemo>;
}

const EventDemo = ({ event }: { event: jh.event }) => {
  const clients = useClientsStyles();
  const { hover } = useHoverEvent(event);
  //TODO: make this a function
  const clientsStyles = useClientsStyles();
  const color = clientsStyles.response?.colors[event.client].style || "#abcabc";

  const [colorPicker, setColorPicker] = useState<Color>(color);

  const style = useStyles(hover, event, colorPicker as string);

  return (
    <>
      <div className="flex justify-around px-8 small_screen_w:mb-4 ">
        <div className="flex flex-col gap-4">
          <div className="rounded-md" style={style?.dinamic}>
            <EventCardDemo
              event={event}
              refNode={createRef()}
              style={style?.static || {}}
            />
          </div>
          <div className="flex flex-col">
            <div className="hue-horizontal hidden"></div>
            <SliderPicker
              color={colorPicker}
              onChangeComplete={(color) => {
                setColorPicker(color.hex);
                const id = clientsStyles.response?.colors[event.client].id ?? 0;
                queryChangeClientStyle(id, color.hex);
                if (!clients.response) {
                  return;
                }
                clients.response.update((prev) => {
                  prev[event.client] = {
                    ...prev[event.client],
                    style: color.hex,
                  };

                  return { ...prev };
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

async function queryChangeClientStyle(id: number, color: string )
{
    if(id === 0)
    {
        console.error('[Error]: Settings layout did not found style id to pass to queryChangeClientStyle');
        return;
    }
    const PUT_URI = `https://jhdiary.com/api/style/${id}?style=${encodeURIComponent(color)}`;

    const nodeList = window.document.querySelectorAll<jh.csrf> ( 'meta[name=csrf-token]');
    const csrf = Array.from(nodeList)[0];

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("X-CSRF-TOKEN", csrf.content);

    const formdata = new FormData();

    const requestOptions : RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };


    fetch(PUT_URI, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}

async function queryAddClientStyle(name:string, type:"client"|"team"|"private"|"public", color: string )
{
    const POST_URI = "https://jhdiary.com/api/style";

    const nodeList = window.document.querySelectorAll<jh.csrf> ( 'meta[name=csrf-token]');
    const csrf = Array.from(nodeList)[0];

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer 7|AqGQZPjyX6qe62NtWgkFgKi44OP7vBeimCsWU406");
    myHeaders.append("X-CSRF-TOKEN", csrf.content);

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("type", type);
    formdata.append("style", color);

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(POST_URI, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}

async function queryAddClient(name: string, password: string, repeatPassword: string)
{
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/vnd.api+json");

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("role", "client");
    formdata.append("password", password);
    formdata.append("style", "#aabbcc");
    formdata.append("password_confirmation", repeatPassword);

    const requestOptions : RequestInit = {method: 'POST', headers: myHeaders, body: formdata, redirect: 'follow'};

    return fetch("https://jhdiary.com/api/register", requestOptions);
    //TODO fetch: comform this match the prev endpoint [api.routes.backoffice.addUser]
    //return fetch(new Request(apiRoutes.user), {method: "POST", body: data});
}

async function queryAddUser(name: string, role: "partner" | "client", password: string, repeatPassword: string)
{
    const myHeaders = new Headers();
    const nodeList = window.document.querySelectorAll<jh.csrf> ( 'meta[name=csrf-token]');
    const csrf = Array.from(nodeList)[0];

    myHeaders.append("X-CSRF-TOKEN", csrf.content);
    myHeaders.append("Accept", "application/vnd.api+json");

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("role", role);
    formdata.append("password", password);
    formdata.append("style", "#aabbcc");
    formdata.append("password_confirmation", repeatPassword);

    const requestOptions :RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    return fetch("https://jhdiary.com/api/register", requestOptions)
}
