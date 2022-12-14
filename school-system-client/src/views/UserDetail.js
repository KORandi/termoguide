import { Grid } from "@mui/material";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ControlPanel } from "../components/control-panel/ControlPanel";
import { Layout } from "../containers/Layout";
import { useContent, useDeleteContent } from "../hooks/useContent";
import { ADMIN, SELF } from "../config/roles";
import { withRole } from "../containers/withRole";

export const UserDetail = withRole([ADMIN, SELF], () => {
  const { id } = useParams();
  const { data } = useContent("user", id);
  const remove = useDeleteContent("user", id);
  const navigate = useNavigate();

  const handleDelete = useCallback(async () => {
    if (!(await remove())) return;
    navigate("/app/users");
  }, [navigate, remove]);

  return (
    <Layout isLoading={!data} active="users">
      <ControlPanel
        title={"User Detail"}
        id={id}
        page={"user"}
        rolesDelete={[ADMIN]}
        onDelete={handleDelete}
        rolesEdit={[ADMIN]}
      />
      <Grid container>
        <Grid xs={6}>
          <strong>Name:</strong>
        </Grid>
        <Grid xs={6}>{data?.name}</Grid>
      </Grid>
      <Grid container>
        <Grid xs={6}>
          <strong>Surname:</strong>
        </Grid>
        <Grid xs={6}>{data?.surname}</Grid>
      </Grid>
      <Grid container>
        <Grid xs={6}>
          <strong>Role:</strong>
        </Grid>
        <Grid xs={6}>{data?.groups?.map(({ name }) => name).join(", ")}</Grid>
      </Grid>
      <Grid container>
        <Grid xs={6}>
          {" "}
          <strong>Email:</strong>
        </Grid>
        <Grid xs={6}>
          <a href={`mailto:${data?.email}`}>{data?.email}</a>
        </Grid>
      </Grid>
    </Layout>
  );
});
