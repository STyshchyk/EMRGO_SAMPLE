import * as React from "react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import ConnectedApp from "./app/app";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ConnectedApp />
  </StrictMode>
);
