import { Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../containers/Layout";
import { withRole } from "../containers/withRole";
import { ControlledTextField } from "../components/fields/input/ControlledTextField";
import { ADMIN } from "../config/roles";
import { useForm } from "react-hook-form";
import { useCallback, useMemo } from "react";
import { useContent, useEditContent } from "../hooks/useContent";
import { useEffect } from "react";
import { ControlledAutocomplete } from "../components/fields/input/ControlledAutocomplete";

export const GatewayEdit = withRole([ADMIN], () => {
  const { id } = useParams();
  const { control, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const modify = useEditContent("gateway");
  const { data: gateway } = useContent("gateway", id);
  const { data: users } = useContent("users");

  const userOptions = useMemo(
    () =>
      users?.map(({ id, name, surname }) => ({
        value: id,
        name: `${name} ${surname}`,
      })) || [],
    [users]
  );

  const owners = useMemo(() => {
    const owners = gateway?.data?.owners || [];
    return userOptions.filter((option) => owners.includes(option.value));
  }, [gateway?.data?.owners, userOptions]);

  const onSubmit = useCallback(
    async ({ owners, ...data }) => {
      await modify({ ...data, id, owners: owners.map(({ value }) => value) });
      navigate("/app/gateways");
    },
    [id, modify, navigate]
  );

  useEffect(() => {
    reset({
      name: gateway?.data?.name,
      secret: gateway?.data?.secret,
      owners: owners,
    });
  }, [gateway, owners, reset]);

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
            <ControlledAutocomplete
              name="owners"
              control={control}
              label="Owners"
              variant="outlined"
              options={userOptions}
              getOptionLabel={(option) =>
                option?.name ? `${option.name}` : ""
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
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
