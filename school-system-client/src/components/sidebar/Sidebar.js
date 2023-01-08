import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { Box, Typography } from "@mui/material";
import { useStyles } from "../../hooks/useStyles";

export const Sidebar = (props) => {
  const { active } = props;
  const user = useUser();

  const handleSignOut = useCallback(() => {
    user.logout();
    window.location.href = "/app/login";
  }, [user]);

  const className = useStyles();

  return (
    <div className={className.sidebarMenu}>
      <UserProfileView />
      <div className={className.menuItems}>
        <Link
          to="/app/gateways"
          className={classNames({
            [className.activeItem]: active === "gateways",
            [className.inactiveItem]: active !== "gateways",
          })}
        >
          Gateways
        </Link>
        <Link
          to="/app/users"
          className={classNames({
            [className.activeItem]: active === "users",
            [className.inactiveItem]: active !== "users",
          })}
        >
          Users
        </Link>
      </div>
      <Box px="0.5rem">
        <button
          onClick={handleSignOut}
          id="sign-out-btn"
          className={className.signout}
        >
          Sign Out
        </button>
      </Box>
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

  const className = useStyles();

  return (
    <div>
      <Link to={`/app/user/edit/${user.getUser()?.id}`}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ2wn18dnC8OmX7Qx49epjgoHREUBHEviB10griBGemOmkYQoK5g"
          className={className.profilePic}
          alt="profile pic"
        />
      </Link>
      <h3 className={className.displayName}>{fullName}</h3>
      <Typography variant="subtitle2">{roles.join(", ")}</Typography>
    </div>
  );
};
