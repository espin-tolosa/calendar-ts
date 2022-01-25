import { useState } from "react";
import * as tw_Controller from "./tw";

export const CreateEvent = () => {
  const [description, setDescription] = useState("");
  const [job, setJob] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  return (
    <tw_Controller.form
      action="post"
      onSubmit={(event) => {
        event.preventDefault();
        console.log("Hello");
      }}
    >
      <tw_Controller.button
        type="submit"
        value="Create"
        onClick={() => {
          document.documentElement.style.setProperty(
            "--calendar_width",
            "900px"
          );
        }}
      />
      <tw_Controller.button
        type="submit"
        value="Reduce"
        title="Testing to reduce calendar"
        onClick={() => {
          document.documentElement.style.setProperty(
            "--calendar_width",
            "740px"
          );
        }}
      />
      <tw_Controller.startEnd>
        <tw_Controller.date
          type="text"
          name="start"
          id="start"
          onChange={(e) => {
            setStart(e.target.value);
          }}
          value={start}
          placeholder="init date"
          title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
        />
        <tw_Controller.date
          type="text"
          name="end"
          id="end"
          onChange={(e) => {
            setEnd(e.target.value);
          }}
          value={end}
          placeholder="end date"
          title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
        />
      </tw_Controller.startEnd>

      <tw_Controller.job
        onChange={(e) => {
          setJob(e.target.value);
        }}
        type="text"
        name="job"
        id="job"
        value={job}
        placeholder="Job"
      />
      <tw_Controller.description_wrap>
        <tw_Controller.description
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          name="text"
          id="text"
          value={description}
          placeholder="Extra notes..."
        ></tw_Controller.description>
      </tw_Controller.description_wrap>
    </tw_Controller.form>
  );
};
