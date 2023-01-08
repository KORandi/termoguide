import { Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ControlledTextField } from "../components/fields/input/ControlledTextField";
import { WholePageLoader } from "../containers/WholePageLoader";
import { useUser } from "../contexts/userContext";
import { useLoginStyles } from "../hooks/useLoginStyles";
import { login } from "../utils/api";

export const LoginView = () => {
  const userContext = useUser();
  const navigate = useNavigate();
  const token = userContext.getToken();

  useEffect(() => {
    if (token) {
      navigate("/app/gateways");
    }
  }, [token, navigate]);

  return <>{!userContext.getToken() && <Login />}</>;
};

export const Login = () => {
  const { control, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const userContext = useUser();
  const [isLoaded, setIsLoaded] = useState(true);
  const navigate = useNavigate();

  const loginHandler = useCallback(
    ({ token, ...data }) => {
      userContext.login(token, data.user);
      navigate("/app/gateways");
    },
    [navigate, userContext]
  );

  const formHandler = useCallback(
    async ({ email, password }) => {
      try {
        setIsLoaded(false);
        const response = await login(email, password);
        loginHandler(response);
      } catch (error) {
        setErrorMessage(error.message);
        setIsLoaded(true);
      }
    },
    [loginHandler]
  );

  const className = useLoginStyles();

  return (
    <>
      {!isLoaded && (
        <div style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}>
          <div style={{ position: "relative" }}>
            <WholePageLoader />
          </div>
        </div>
      )}
      <form
        className={className.containerWrapper}
        onSubmit={handleSubmit(formHandler)}
      >
        <div className={className.container}>
          <Grid width="80%" display="flex" direction="column" gap="1rem">
            <Grid className={className.title} xs={12} item>
              TermoGuide
            </Grid>
            <Grid xs={12} item>
              <ControlledTextField
                control={control}
                name="email"
                type="email"
                label="E-mail"
              />
            </Grid>
            <Grid xs={12} item>
              <ControlledTextField
                control={control}
                name="password"
                type="password"
                label="Password"
              />
            </Grid>
          </Grid>
          <div>
            {errorMessage && (
              <div style={{ marginTop: "15px" }}>
                <span className="text-danger">{errorMessage}</span>
              </div>
            )}
          </div>
          <button className={className.button} type="submit">
            log in
          </button>
        </div>
      </form>
    </>
  );
};
