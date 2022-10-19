import { Loader } from "../components/loader/Loader";
import { Sidebar } from "../components/sidebar";

export const Layout = ({ children, active, isLoading }) => {
  return (
    <>
      <div id="dashboard">
        <Sidebar active={active} />
        <div className="dash-view">{children}</div>
      </div>
      {isLoading && <Loader />}
    </>
  );
};
