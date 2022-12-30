import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Layout } from "../containers/Layout";
import { withRole } from "../containers/withRole";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "../components/fields/input/ControlledTextField";
import { ADMIN } from "../config/roles";
import { useCallback, useMemo } from "react";
import { useAddContent, useContent } from "../hooks/useContent";
import { ControlledAutocomplete } from "../components/fields/input/ControlledAutocomplete";

export const GatewayAdd = withRole([ADMIN], () => {
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const add = useAddContent("gateway");
  const { data: users } = useContent("users");

  const userOptions = useMemo(
    () =>
      users?.map(({ id, name, surname }) => ({
        value: id,
        name: `${name} ${surname}`,
      })) || [],
    [users]
  );

  const onSubmit = useCallback(
    async ({ owners, ...data }) => {
      await add({ ...data, owners: owners.map((owner) => owner.value) });
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
              rules={{
                pattern: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/,
                required: "This field is required",
              }}
              label="MAC Address"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="ip_address"
              control={control}
              rules={{
                required: "This field is required",
                pattern:
                  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
              }}
              label="IP Address"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledAutocomplete
              name="owners"
              control={control}
              label="Owners"
              variant="outlined"
              options={userOptions}
              getOptionLabel={(option) =>
                option?.name ? `${option.name}` : ""
              }
              fullWidth
              multiple
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
