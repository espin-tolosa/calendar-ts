import { composition } from "../interfaces";
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

type IsDragginType = {
  isDragging: boolean;
  setIsDragging: (_value: boolean) => void;
};

const defaultValue = {
  isDragging: false,
  setIsDragging: (value: boolean) => {
    return value;
  },
};

const context = createContext<IsDragginType>(defaultValue);
context.displayName = "Is Dragging";

export namespace Context {
  export const useIsDragging = () => useContext(context);
}

const useIsDragging = () => {
  const [isDragging, setIsDragging] = useState(false);

  return { isDragging, setIsDragging };
};

// check react prop-types out: https://reactjs.org/docs/typechecking-with-proptypes.html
const IsDraggingEvent: composition = (propTypes) => {
  const { isDragging, setIsDragging } = useIsDragging();

  return (
    <context.Provider value={{ isDragging, setIsDragging }}>
      {propTypes.children}
    </context.Provider>
  );
};

IsDraggingEvent.propTypes = {
  children: PropTypes.element.isRequired,
};

export { IsDraggingEvent };
