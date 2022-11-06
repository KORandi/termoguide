import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../containers/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ControlPanel } from "../components/control-panel/ControlPanel";
import { ADMIN } from "../config/roles";
import {
  Grid,
  Button,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useDeleteContent } from "../hooks/useContent";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function createData(name, value) {
  return { name, value };
}

const rows = [
  createData("Avg temperature", 16.5),
  createData("Max temperature", 32),
  createData("Min temperature", 10),
  createData("Avg humidity", 50),
  createData("Max humidity", 70),
  createData("Min humidity", 10),
];

export const GatewayDetail = () => {
  const [value, setValue] = useState(dayjs("2022-04-07"));
  const { id } = useParams();

  const remove = useDeleteContent("gateway", id);
  const navigate = useNavigate();

  const deleteGateway = useCallback(async () => {
    if (!(await remove())) return;
    navigate("/app/gateways");
  }, [navigate, remove]);

  return (
    <Layout active="gateways">
      <ControlPanel
        title={"Gateway Detail"}
        id={id}
        page={"gateway"}
        rolesDelete={[ADMIN]}
        onDelete={deleteGateway}
        rolesEdit={[ADMIN]}
      />
      <Grid container>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Select date and time"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Box
            pt={"1rem"}
            pb={"3rem"}
            display="flex"
            justifyContent={"space-evenly"}
          >
            <Button type="submit" variant="contained">
              1 Minute
            </Button>
            <Button type="submit" variant="contained">
              5 Minutes
            </Button>
            <Button type="submit" variant="contained">
              10 Minutes
            </Button>
            <Button type="submit" variant="contained">
              1 Hour
            </Button>
            <Button type="submit" variant="contained">
              1 Day
            </Button>
            <Button type="submit" variant="contained">
              1 Week
            </Button>
            <Button type="submit" variant="contained">
              1 Month
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <h3>Table data</h3>
        </Grid>
        <Grid item xs={12} height={500}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <h3>Humidity</h3>
        </Grid>
        <Grid item xs={12} height={500}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12}>
          <h3>Temperature</h3>
        </Grid>
        <Grid item xs={12} height={500}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Layout>
  );
};
