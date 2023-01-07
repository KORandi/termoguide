import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { Typography } from "@mui/material";

export const Sidebar = (props) => {
  const { active } = props;
  const user = useUser();

  const handleSignOut = useCallback(() => {
    user.logout();
    window.location.href = "/app/login";
  }, [user]);

  return (
    <div className="sidebar-menu">
      <UserProfileView />
      <div className="menu-items">
        <Link
          to="/app/gateways"
          className={classNames({
            "active-item": active === "gateways",
            "inactive-item": active !== "gateways",
          })}
        >
          Gateways
        </Link>
        <Link
          to="/app/users"
          className={classNames({
            "active-item": active === "users",
            "inactive-item": active !== "users",
          })}
        >
          Users
        </Link>
      </div>
      <div>
        <button onClick={handleSignOut} id="sign-out-btn" className="full-btn">
          Sign Out
        </button>
      </div>
    </div>
  );
};

const UserProfileView = () => {
  const user = useUser();
  const roles = user.getRoles();
  const fullName = useMemo(
    () => `${user.getUser()?.name ?? ""} ${user.getUser()?.surname ?? ""}`,
    [user]
  );

  return (
    <div className="user-profile">
      <Link to={`/app/user/edit/${user.getUser()?.id}`}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ2wn18dnC8OmX7Qx49epjgoHREUBHEviB10griBGemOmkYQoK5g"
          id="profile-pic"
          alt="profile pic"
        />
      </Link>
      <h3 id="display-name">{fullName}</h3>
      <Typography variant="subtitle2">{roles.join(", ")}</Typography>
    </div>
  );
};
