import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";

const reactRootNode = document.getElementById("root") as HTMLElement;

createRoot(reactRootNode).render(
  <React.StrictMode>
    <div className="bg-red-800 text-yellow-200">Mock App</div>
  </React.StrictMode>
);
