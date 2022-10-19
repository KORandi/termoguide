import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { appInitialState, appReducer } from "../reducers/appReducer";

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <AppContext.Provider
      value={{
        error,
        warning,
        success,
        setError,
        setWarning,
        setSuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const user = useContext(AppContext);
  return user;
};
