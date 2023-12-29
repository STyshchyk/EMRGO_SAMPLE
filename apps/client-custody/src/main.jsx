import * as ReactDOM from "react-dom/client";

import moment from "moment-timezone";

import ConnectedApp from "./app/app";

moment.tz.setDefault("Etc/UTC");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ConnectedApp />);
