import { makeStyles } from "@mui/styles";

export const useLoginStyles = makeStyles((theme) => ({
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.12)",
    cursor: "pointer",
    borderRadius: "4px",
    width: "60%",
    padding: "20px 15px",
    backgroundColor: "#007aff",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: 400,
    margin: "40px 0",
    "&:hover, &:focus": {
      transition: "0.15s ease-in-out",
      boxShadow: "0px 3px 20px 3px rgba(0, 122, 255, 0.3)",
      backgroundColor: "#007aff",
    },
  },
  containerWrapper: {
    display: "flex",
    alignItems: "center",
    minHeight: "100vh",
  },
  container: {
    width: "400px",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: "0 auto",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  title: {
    textTransform: "capitalize",
    fontSize: "1.6em",
    fontWeight: "300",
    padding: "60px 0",
    paddingBottom: "10px",
    textAlign: "center",
  },
}));
