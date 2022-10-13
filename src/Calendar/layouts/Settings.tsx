import { EventCardDemo } from "../components/Event/eventCard";
import { useHoverEvent, useStyles } from "../components/Event/logic";
import { useClientsStyles } from "../context/useFetchClientStyle";
import { nullEvent } from "../interfaces";
import { createRef, useRef, useState } from "react";
import { Color, SliderPicker } from "react-color";
import tw from "tailwind-styled-components/dist/tailwind";
import { apiRoutes } from "../static/apiRoutes";

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
  const clients = useClientsStyles();
  const [input_ClientName, set_ClientName] = useState("");
  const [input_Password, set_Password] = useState("");
  const [input_RepeatPassword, set_RepeatPassword] = useState("");
  const [formError, setFormError] = useState<string | boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string | boolean>(false);
  const [formWaiting, setFormWaiting] = useState<string | boolean>(false);
  const [input_ClientError, set_InputClientError] = useState(false);
  const [input_PasswordError, set_InputPasswordError] = useState(false);
  const [input_RepeatPassError, set_InputRepeatPassError] = useState(false);
  const input_ClientRef = useRef<HTMLInputElement>(null);
  const input_PasswordRef = useRef<HTMLInputElement>(null);
  const input_RepeatPasswordRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <ul className="my-30 py-16 grid grid grid-cols-3 gap-16 ">
        {clients.success &&
          clients.response.clients.map((name) => {
            return <Line key={name} name={name} />;
          })}
      </ul>
      <form className="flex gap-2" autoComplete="off" autoSave="off">
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
            queryAddClient(
              input_ClientName,
              input_Password,
              input_RepeatPassword
            )
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
          }}
        >
          +
        </Button>
      </form>
      {formError && <div className="text-red-900">{formError}</div>}
      {formSuccess && <div className="text-green-900">{formSuccess}</div>}
      {formWaiting && <div className="text-slate-500">{formWaiting}</div>}
    </>
  );
}

function Line({ name }: { name: string }) {
  const event: jh.event = {
    ...nullEvent(),
    client: name,
    job: "Job description demo",
  };
  return <EventDemo event={event}></EventDemo>;
}

const EventDemo = ({ event }: { event: jh.event }) => {
  const clients = useClientsStyles();
  const { hover } = useHoverEvent(event);
  //TODO: make this a function
  const clientsStyles = useClientsStyles();
  console.log("Client Styles", clientsStyles.response?.colors["am"].id)
  const color = clientsStyles.response?.colors[event.client].style || "#abcabc";

  const [colorPicker, setColorPicker] = useState<Color>(color);

  const style = useStyles(hover, event, colorPicker as string);

  return (
    <>
      <div className="flex justify-around  ">
        <div className="flex flex-col gap-4">
          <div className="rounded-md" style={style?.dinamic}>
            <EventCardDemo
              event={event}
              refNode={createRef()}
              style={style?.static || {}}
            />
          </div>
          <div className="flex w-40 flex-col">
            <div className="hue-horizontal h-4 hidden"></div>
            <SliderPicker
              color={colorPicker}
              onChangeComplete={(color) => {
                setColorPicker(color.hex);
                //queryChangeClientColor(event.client, color.hex);
                const id = clientsStyles.response?.colors[event.client].id ?? 0;
                queryChangeClientStyle(id, event.client, color.hex)
                //	clients.response.update(prev=>{
                //	})
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

async function queryChangeClientStyle(id: number, client: string, color: string)
{
    console.log(`PUT: ${id}, ${client}, ${color}`);
}

async function queryChangeClientColor(client: string, color: string) {
  const data = new FormData();
  data.append("change-color", JSON.stringify({ client, color }));
  fetch(new Request(apiRoutes.style), {
    method: "POST",
    body: data,
  });
}

async function queryAddClient(
  name: string,
  password: string,
  repeatPassword: string
) {
  const data = new FormData();

  data.append("add-client", JSON.stringify({ name, password, repeatPassword }));

  //TODO fetch: comform this match the prev endpoint [api.routes.backoffice.addUser]
  return fetch(new Request(apiRoutes.user), {
    method: "POST",
    body: data,
  });
}
