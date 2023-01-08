import React from "react";
import { Table } from "../components/table";
import { userColumns } from "../config/columns/users";
import { Layout } from "../containers/Layout";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { useUser } from "../contexts/userContext";
import { useContent } from "../hooks/useContent";
import { ADMIN } from "../config/roles";
import { useStyles } from "../hooks/useStyles";

export const Users = () => {
  const user = useUser();
  const userRoles = user.getRoles();
  const { data } = useContent("users");
  const { viewHeading } = useStyles();

  return (
    <Layout isLoading={!data} active="users">
      <h2 className={viewHeading}>Users</h2>

      <Box mt={3}>
        {userRoles.includes(ADMIN) && (
          <Link to="/app/user/add">
            <Button
              color={"info"}
              variant="contained"
              startIcon={<Add fontSize="small" />}
            >
              Add user
            </Button>
          </Link>
        )}
      </Box>

      <Table columns={userColumns} rows={data || []} />
    </Layout>
  );
};
