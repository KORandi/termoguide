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
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useContent, useDeleteContent } from "../hooks/useContent";
import { useReducer } from "react";
import { useMemo } from "react";

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
  const [state, setState] = useReducer(
    (prevState, currState) => ({ ...prevState, ...currState }),
    {
      date: dayjs().subtract(10, "minute"),
      interval: 60 * 1000,
    }
  );
  const { id } = useParams();
  const { data: temperature } = useContent("gatewayTemperature", state);
  const { data: humidity } = useContent("gatewayHumidity", id);

  const remove = useDeleteContent("gateway", id);
  const navigate = useNavigate();

  const deleteGateway = useCallback(async () => {
    if (!(await remove())) return;
    navigate("/app/gateways");
  }, [navigate, remove]);

  const graphTemperature = useMemo(() => {
    return temperature?.data.map((temp) => ({
      temperature: temp.temperatureAvg,
      time: dayjs(temp.date).format("HH:mm:ss"),
      date: dayjs(temp.date).format("DD.MM.YYYY"),
    }));
  }, [temperature]);

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
          <Box display="flex">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box mr="0.5rem">
                <FormControl>
                  <InputLabel>Interval</InputLabel>
                  <Select
                    value={state.interval}
                    label="Interval"
                    onChange={(val) => {
                      setState({ interval: val.target.value });
                    }}
                  >
                    <MenuItem defaultChecked value={60000}>
                      1 Minute
                    </MenuItem>
                    <MenuItem value={300000}>5 Minutes</MenuItem>
                    <MenuItem value={600000}>10 Minutes</MenuItem>
                    <MenuItem value={3600000}>1 Hour</MenuItem>
                    <MenuItem value={86400000}>1 Day</MenuItem>
                    <MenuItem value={604800000}>1 Week</MenuItem>
                    <MenuItem value={2592000000}>1 Month</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box mr="0.5rem">
                <MobileDatePicker
                  renderInput={(props) => <TextField disabled {...props} />}
                  label="Date"
                  inputFormat="DD.MM.YYYY"
                  value={state.date}
                  onChange={(newValue) => {
                    setState({ date: newValue });
                  }}
                />
              </Box>
              {state.interval < 86400000 && (
                <TimePicker
                  label="Time"
                  value={state.date}
                  onChange={(newValue) => {
                    setState({ date: newValue });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            </LocalizationProvider>
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
              data={graphTemperature || []}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={state.interval < 86400000 ? "time" : "date"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Layout>
  );
};
