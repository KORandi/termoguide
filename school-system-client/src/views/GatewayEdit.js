import { Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../containers/Layout";
import { withRole } from "../containers/withRole";
import { ControlledTextField } from "../components/fields/input/ControlledTextField";
import { ADMIN } from "../config/roles";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useContent, useEditContent } from "../hooks/useContent";
import { useEffect } from "react";

export const GatewayEdit = withRole([ADMIN], () => {
  const { id } = useParams();
  const { control, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const modify = useEditContent("gateway");
  const { data: gateway } = useContent("gateway", id);

  const onSubmit = useCallback(
    async (data) => {
      await modify({ ...data, id });
      navigate("/app/gateways");
    },
    [id, modify, navigate]
  );

  useEffect(() => {
    reset({ name: gateway?.data?.name, secret: gateway?.data?.secret });
  }, [gateway, reset]);

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
              defaultValue={gateway?.data?.name}
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
              disabled
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
