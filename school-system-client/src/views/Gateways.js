import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Table } from "../components/table";
import { gatewayColumns } from "../config/columns/gateways";
import { Layout } from "../containers/Layout";
import { useUser } from "../contexts/userContext";
import { ADMIN } from "../config/roles";
import { useContent } from "../hooks/useContent";

export const Gateways = () => {
  const user = useUser();
  const userRoles = user.getRoles();
  const { data } = useContent("gateways");

  return (
    <>
      <Layout isLoading={!data} active="gateways">
        <h2 className="view-heading">Gateways</h2>
        <Box mt={3}>
          {userRoles.includes(ADMIN) && (
            <Link to="/app/gateway/add">
              <Button variant="outlined" startIcon={<Add fontSize="small" />}>
                Add gateway
              </Button>
            </Link>
          )}
        </Box>
        <Table columns={gatewayColumns} rows={data || []} />
      </Layout>
    </>
  );
};
