import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./contexts/appContext";
import { UserProvider } from "./contexts/userContext";
import { SWRConfig } from "swr";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <SWRConfig>
        <AppProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppProvider>
      </SWRConfig>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
