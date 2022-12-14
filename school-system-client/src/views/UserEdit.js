import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../containers/Layout";
import { withRole } from "../containers/withRole";
import { useContent, useEditContent } from "../hooks/useContent";
import { Controller, useForm } from "react-hook-form";
import { ControlledTextField } from "../components/fields/input/ControlledTextField";
import { ControlledAutocomplete } from "../components/fields/input/ControlledAutocomplete";
import { useUser } from "../contexts/userContext";
import { ADMIN, SELF, USER } from "../config/roles";

export const ROLES = [
  { name: "User", value: USER },
  { name: "Admin", value: ADMIN },
];

export const BOOLEAN = [
  { name: "true", value: true },
  { name: "false", value: false },
];

export const UserEdit = withRole([ADMIN, SELF], () => {
  const { id } = useParams();
  const { data } = useContent("user", id);
  const update = useEditContent("user");
  const { control, handleSubmit, reset, watch: watchForm } = useForm();
  const password = useRef({});
  const {
    control: controlPassword,
    handleSubmit: onSubmitPassword,
    watch,
  } = useForm();

  password.current = watch("password", "");
  const thirdParty = watchForm("thirdPartyIdentity", false);

  const user = useUser();
  const userRoles = user.getRoles();
  const hasAdmin = userRoles.includes(ADMIN);
  const isSameUser = user.getUser()?.id === id;
  const updatePassword = useEditContent("userPassword");

  const navigate = useNavigate();

  useEffect(() => {
    const parsedData = {
      ...data,
      password: undefined,
      groups:
        data.groups
          ?.map(({ name }) => ROLES.find(({ value }) => value === name))
          .filter((e) => e) ?? [].map(({ value }) => value),
    };
    reset(parsedData);
  }, [data, reset]);

  const onSubmit = useCallback(
    async (data) => {
      const parsedData = {
        ...data,
        groups: data?.groups?.map(({ value }) => value) ?? [],
      };
      if (!(await update(parsedData))) return;
      navigate("/app/users");
    },
    [navigate, update]
  );

  const handlePasswordChange = useCallback(
    (data) => {
      const { password } = data;
      updatePassword({ password, id });
      navigate("/app/users");
    },
    [id, navigate, updatePassword]
  );

  return (
    <Layout isLoading={!data} active="users">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
        noValidate
      >
        <Grid justifyContent={"start"} container spacing={2}>
          <Grid item xs={6}>
            <ControlledTextField
              control={control}
              name="name"
              rules={{ required: "This field is required" }}
              label="Name"
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <ControlledTextField
              control={control}
              name="surname"
              rules={{ required: "This field is required" }}
              label="Surname"
              variant="outlined"
              fullWidth
            />
          </Grid>

          {hasAdmin && (
            <Grid item xs={6}>
              <ControlledAutocomplete
                control={control}
                multiple
                rules={{ required: "This field is required" }}
                label="Role"
                name="groups"
                options={ROLES}
                getOptionLabel={(option) =>
                  option?.name ? `${option.name}` : ""
                }
              />
            </Grid>
          )}

          <Grid item xs={6}>
            <ControlledTextField
              control={control}
              name={"email"}
              rules={{
                required: "This field is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              }}
              label="Email"
              disabled={!hasAdmin}
              variant="outlined"
              fullWidth
            />
          </Grid>

          {hasAdmin && (
            <Grid item xs={6}>
              <Controller
                control={control}
                name="resetPassword"
                render={({ field: { value, ...field } }) => (
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox {...field} checked={value || false} />}
                      label="Request user to change password"
                    />
                  </FormGroup>
                )}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      {(isSameUser || hasAdmin) && !thirdParty && (
        <form onSubmit={onSubmitPassword(handlePasswordChange)} noValidate>
          <Grid spacing={2} container>
            <Grid pb={2} xs={12} item>
              <hr />
              <Typography variant="h5">Password change</Typography>
            </Grid>
            <Grid xs={6} item>
              <ControlledTextField
                control={controlPassword}
                name={"password"}
                rules={{
                  required: "This field is required",
                  minLength: 5,
                }}
                type="password"
                label="New password"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid xs={6} item>
              <ControlledTextField
                control={controlPassword}
                name={"repeat-password"}
                rules={{
                  required: "This field is required",
                  validate: (value) => {
                    return (
                      value === password.current || "The passwords do not match"
                    );
                  },
                }}
                type="password"
                label="Confirm password"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid xs={12} item>
              <Button type="submit" variant="contained">
                Change password
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Layout>
  );
});
