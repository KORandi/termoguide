import { Link } from "react-router-dom";

export const subjectColumns = [
  {
    field: "name",
    headerName: "Name",
    renderCell: ({ row: { name, id } }) => (
      <Link to={`/app/gateway/${id}`}>{name}</Link>
    ),
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
  },
];
