import { createContext, useContext, useState } from "react";
import { validateUser } from "../utils/api";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getRoles = () => {
    return user.groups.map(({ name }) => name);
  };

  const getUser = () => {
    return user;
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const setToken = (token) => {
    return localStorage.setItem("token", token);
  };

  const login = (token, user) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.clear("token");
  };

  const validate = validateUser;

  return (
    <UserContext.Provider
      value={{
        getUser,
        setUser,
        getToken,
        setToken,
        login,
        logout,
        getRoles,
        validate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user = useContext(UserContext);
  return user;
};
