import "bootstrap/dist/css/bootstrap.min.css";
import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/style.css";
import { validateUser } from "./utils/api";
import { WholePageLoader } from "./containers/WholePageLoader";
import { useUser } from "./contexts/userContext";
import { LoginView } from "./views/Login";
import { Users } from "./views/Users";
import { UserDetail } from "./views/UserDetail";
import { UserAdd } from "./views/UserAdd";
import { UserEdit } from "./views/UserEdit";
import { Gateways } from "./views/Gateways";
import { GatewayDetail } from "./views/GatewayDetail";
import { GatewayAdd } from "./views/GatewayAdd";
import { GatewayEdit } from "./views/GatewayEdit";
import { useApp } from "./contexts/appContext";
import { Alert, AlertTitle, Slide, Snackbar } from "@mui/material";

function App() {
  const [hasAccess, setAccess] = useState(null);
  const user = useUser();
  const { error, setError, warning, setWarning, success, setSuccess } =
    useApp();
  const token = user.getToken();

  const handleErrorClose = useCallback(() => {
    setError("");
  }, [setError]);

  const handleWarningClose = useCallback(() => {
    setWarning("");
  }, [setWarning]);

  const handleSuccessClose = useCallback(() => {
    setSuccess("");
  }, [setSuccess]);

  useEffect(() => {
    const token = user.getToken();
    if (!token) {
      setAccess(false);
      return;
    }
    (async () => {
      try {
        const data = await validateUser();
        user.setUser(data.user);
        setAccess(true);
        if (data.user?.resetPassword) {
          setWarning("Change your password, in your profile settings.");
        }
      } catch (error) {
        setAccess(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="App">
      {hasAccess === null && <WholePageLoader />}
      {hasAccess !== null && (
        <>
          <Routes>
            {hasAccess && (
              <>
                <Route exact path="/app" element={<Gateways />} />
                <Route path="/app/gateways" element={<Gateways />} />
                <Route path="/app/gateway/add" element={<GatewayAdd />} />
                <Route path="/app/gateway/edit/:id" element={<GatewayEdit />} />
                <Route path="/app/gateway/:id" element={<GatewayDetail />} />
                <Route path="/app/users" element={<Users />} />
                <Route path="/app/user/:id" element={<UserDetail />} />
                <Route path="/app/user/add" element={<UserAdd />} />
                <Route path="/app/user/edit/:id" element={<UserEdit />} />
                <Route path="/app/login" element={<LoginView />} />
                <Route path="/app/*" element={<Gateways />} />
              </>
            )}
            <Route path="*" element={<LoginView />} />
          </Routes>
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleErrorClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Slide}
          >
            <Alert onClose={handleErrorClose} severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!warning && !error}
            autoHideDuration={6000}
            onClose={handleWarningClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Slide}
          >
            <Alert onClose={handleWarningClose} severity="warning">
              <AlertTitle>Warning</AlertTitle>
              {warning}
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!success && !error && !warning}
            autoHideDuration={6000}
            onClose={handleSuccessClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Slide}
          >
            <Alert onClose={handleSuccessClose} severity="success">
              <AlertTitle>Success</AlertTitle>
              {success}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
}

export default App;
