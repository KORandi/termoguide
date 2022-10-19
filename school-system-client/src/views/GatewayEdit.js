import { Button, Grid, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import { Layout } from "../containers/Layout";
import { withRole } from "../containers/withRole";
import { ControlledAutocomplete } from "../components/fields/input/ControlledAutocomplete";
import { ControlledTextField } from "../components/fields/input/ControlledTextField";
import { ADMIN } from "../config/roles";
import { useForm } from "react-hook-form";

export const GatewayEdit = withRole([ADMIN], () => {
  const { id } = useParams();
  const { control } = useForm();

  return (
    <Layout active="gateways">
      <form style={{ paddingTop: "2rem", paddingBottom: "2rem" }} noValidate>
        <Grid justifyContent={"start"} container spacing={2}>
          <Grid item xs={12}>
            <ControlledTextField
              name="name"
              control={control}
              rules={{ required: "This field is required" }}
              label="Subject name"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="goal"
              control={control}
              label="Subject goal"
              rules={{ required: "This field is required" }}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledAutocomplete
              control={control}
              rules={{ required: "This field is required" }}
              label="Supervisor"
              name="supervisor"
              options={[]}
              getOptionLabel={(option) =>
                option?.name
                  ? `${option?.name || ""} ${option?.surname || ""}`
                  : ""
              }
            />
          </Grid>

          <Grid item xs={6}>
            <ControlledAutocomplete
              control={control}
              name="teachers"
              rules={{ required: "This field is required" }}
              label={"Teachers"}
              multiple
              options={[]}
              getOptionLabel={(option) => `${option?.name} ${option?.surname}`}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledTextField
              type="number"
              name="credits"
              control={control}
              rules={{ required: "This field is required" }}
              label="Number of credits"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledAutocomplete
              control={control}
              name="studyProgramme"
              label={"Study Programme"}
              rules={{ required: "This field is required" }}
              options={[]}
              getOptionLabel={(option) =>
                option?.name ? `${option?.name}` : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledTextField
              name="language"
              control={control}
              rules={{ required: "This field is required" }}
              label="Language"
              variant="outlined"
              fullWidth
              select
            >
              <MenuItem value="cs">Czech</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </ControlledTextField>
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
