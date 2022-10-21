import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ViewTrapProvider } from "./components/viewtrap";
import { AppProvider } from "./contexts/appContext";
import { UserProvider } from "./contexts/userContext";
import { SWRConfig } from "swr";

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <SWRConfig>
          <AppProvider>
            <ViewTrapProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ViewTrapProvider>
          </AppProvider>
        </SWRConfig>
      </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
