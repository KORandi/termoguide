import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Layout } from "../containers/Layout";
import { withRole } from "../containers/withRole";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "../components/fields/input/ControlledTextField";
import { ADMIN } from "../config/roles";
import { useCallback } from "react";
import { useAddContent } from "../hooks/useContent";

export const GatewayAdd = withRole([ADMIN], () => {
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const add = useAddContent("gateway");

  const onSubmit = useCallback(
    async (data) => {
      await add(data);
      navigate("/app/gateways");
    },
    [add, navigate]
  );

  return (
    <Layout active="gateways">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
        noValidate
      >
        <Grid justifyContent={"start"} container spacing={2}>
          <Grid item xs={12}>
            <ControlledTextField
              name="name"
              control={control}
              rules={{ required: "This field is required" }}
              label="Gateway name"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="secret"
              control={control}
              rules={{ required: "This field is required" }}
              label="Secret"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
});
