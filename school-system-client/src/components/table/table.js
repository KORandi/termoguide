import { DataGrid } from "@mui/x-data-grid";

export const Table = ({ rows, columns }) => {
  return (
    <div style={{ height: "600px", paddingBottom: "2rem", paddingTop: "2rem" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[25]}
      />
    </div>
  );
};
