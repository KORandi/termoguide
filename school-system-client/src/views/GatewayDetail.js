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
  Alert,
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

const TIME_IN_MS = {
  MINUTE: 60000,
  FIVE_MINUTES: 300000,
  TEN_MINUTES: 600000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
  MONTH: 2592000000,
};

function createRow(name, value) {
  return { name, value };
}

const STEP = 30;
const DEFAULT_TIME = TIME_IN_MS.HOUR;

function timerSetter(interval) {
  const day = dayjs();
  const roundedMinutes = Math.round(day.get("minute") / 10) * 10;
  switch (interval) {
    case TIME_IN_MS.MINUTE:
      return day.subtract(STEP + 1, "minute");
    case TIME_IN_MS.FIVE_MINUTES:
      return day
        .subtract((STEP + 1) * 5, "minute")
        .set("minute", roundedMinutes);
    case TIME_IN_MS.TEN_MINUTES:
      return day
        .subtract((STEP + 1) * 10, "minute")
        .set("minute", roundedMinutes);
    case TIME_IN_MS.HOUR:
      return day.subtract(STEP + 1, "hour").set("minute", 0);
    case TIME_IN_MS.DAY:
      return day.subtract(STEP + 1, "day");
    case TIME_IN_MS.WEEK:
      return day.subtract(STEP + 1, "week");
    case TIME_IN_MS.MONTH:
      return day.subtract(STEP + 1, "month");
    default:
      return day;
  }
}

export const GatewayDetail = () => {
  const [state, setState] = useReducer(
    (prevState, currState) => ({ ...prevState, ...currState }),
    {
      date: timerSetter(DEFAULT_TIME),
      interval: DEFAULT_TIME,
      limit: STEP,
    }
  );
  const { id } = useParams();
  const { data: temperature } = useContent("gatewayTemperature", state);
  const { data: humidity } = useContent("gatewayHumidity", state);

  const remove = useDeleteContent("gateway", id);
  const navigate = useNavigate();

  const deleteGateway = useCallback(async () => {
    if (!(await remove())) return;
    navigate("/app/gateways");
  }, [navigate, remove]);

  const graphTemperature = useMemo(() => {
    return temperature?.data?.data?.map((temp) => ({
      temperature: temp.temperatureAvg,
      datetime: dayjs(temp.date).format("HH:mm:ss DD.MM.YYYY"),
    }));
  }, [temperature]);

  const graphHumidity = useMemo(() => {
    return humidity?.data?.data?.map((hum) => ({
      humidity: hum.humidityAvg,
      datetime: dayjs(hum.date).format("HH:mm:ss DD.MM.YYYY"),
    }));
  }, [humidity]);

  const rows = useMemo(() => {
    return [
      createRow("Maximum temperature", `${temperature?.data?.max}°C` ?? "N/A"),
      createRow("Minimum temperature", `${temperature?.data?.min}°C` ?? "N/A"),
      createRow(
        "Average temperature",
        `${temperature?.data?.average}°C` ?? "N/A"
      ),
      createRow("Maximum humidity", `${humidity?.data?.max}%` ?? "N/A"),
      createRow("Minimum humidity", `${humidity?.data?.min}%` ?? "N/A"),
      createRow("Average humidity", `${humidity?.data?.average}%` ?? "N/A"),
    ];
  }, [temperature, humidity]);

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
                      setState({
                        interval: val.target.value,
                        date: timerSetter(val.target.value),
                      });
                    }}
                  >
                    <MenuItem defaultChecked value={TIME_IN_MS.MINUTE}>
                      1 Minute
                    </MenuItem>
                    <MenuItem value={TIME_IN_MS.FIVE_MINUTES}>
                      5 Minutes
                    </MenuItem>
                    <MenuItem value={TIME_IN_MS.TEN_MINUTES}>
                      10 Minutes
                    </MenuItem>
                    <MenuItem value={TIME_IN_MS.HOUR}>1 Hour</MenuItem>
                    <MenuItem value={TIME_IN_MS.DAY}>1 Day</MenuItem>
                    <MenuItem value={TIME_IN_MS.WEEK}>1 Week</MenuItem>
                    <MenuItem value={TIME_IN_MS.MONTH}>1 Month</MenuItem>
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
              {state.interval < TIME_IN_MS.DAY && (
                <TimePicker
                  label="Time"
                  value={state.date}
                  onChange={(newValue) => {
                    setState({ date: newValue });
                  }}
                  shouldDisableTime={
                    state.interval > TIME_IN_MS.TEN_MINUTES
                      ? (timeValue, clockType) => {
                          return clockType === "minutes" && timeValue > 0;
                        }
                      : undefined
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            </LocalizationProvider>
          </Box>
          <Box my={"0.5rem"}>
            <Alert severity="info">
              Changing interval will also reset date and time
            </Alert>
          </Box>
        </Grid>
        <Grid my={"2rem"} item xs={12}>
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
        <Grid mb="1rem" item xs={12}>
          <h3 style={{ textAlign: "center" }}>Humidity</h3>
        </Grid>
        <Grid item xs={12} height={500}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={graphHumidity || []}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datetime" />
              <YAxis
                tickFormatter={(tick) => `${tick}%`}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid mb="1rem" mt="2rem" item xs={12}>
          <h3 style={{ textAlign: "center" }}>Temperature</h3>
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
              <XAxis dataKey="datetime" />
              <YAxis
                tickFormatter={(tick) => `${tick}°C`}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Layout>
  );
};
