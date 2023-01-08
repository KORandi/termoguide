import { Loader } from "../components/loader/Loader";
import { Sidebar } from "../components/sidebar";
import { useStyles } from "../hooks/useStyles";

export const Layout = ({ children, active, isLoading }) => {
  const className = useStyles();
  return (
    <>
      <div className={className.layout}>
        <Sidebar active={active} />
        <div className={className.dashboardView}>{children}</div>
      </div>
      {isLoading && <Loader />}
    </>
  );
};
