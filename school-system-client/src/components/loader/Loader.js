import { WholePageLoader } from "../../containers/WholePageLoader";

export const Loader = () => {
  return (
    <div style={{ position: "fixed", top: 0, left: 0 }}>
      <div style={{ position: "relative" }}>
        <WholePageLoader />
      </div>
    </div>
  );
};
