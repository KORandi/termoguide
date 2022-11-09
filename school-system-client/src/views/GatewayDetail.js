import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../containers/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  FormControlLabel,
  Checkbox,
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

function timerSetter(interval, step) {
  const day = dayjs();
  let roundedMinutes = 0;
  switch (interval) {
    case TIME_IN_MS.MINUTE:
      return day.subtract(step + 1, "minute");
    case TIME_IN_MS.FIVE_MINUTES:
      const d = day.subtract((step + 1) * 5, "minute");
      roundedMinutes = Math.round(d.get("minute") / 10) * 10;
      return d.set("minute", roundedMinutes);
    case TIME_IN_MS.TEN_MINUTES:
      roundedMinutes = Math.round(day.get("minute") / 10) * 10;
      return day
        .subtract((step + 1) * 10, "minute")
        .set("minute", roundedMinutes);
    case TIME_IN_MS.HOUR:
      return day.subtract(step + 1, "hour").set("minute", 0);
    case TIME_IN_MS.DAY:
      return day.subtract(step + 1, "day");
    case TIME_IN_MS.WEEK:
      return day.subtract(step + 1, "week");
    case TIME_IN_MS.MONTH:
      return day.subtract(step + 1, "month");
    default:
      return day;
  }
}

export const GatewayDetail = () => {
  const [state, setState] = useReducer(
    (prevState, currState) => ({ ...prevState, ...currState }),
    {
      date: timerSetter(DEFAULT_TIME, STEP),
      interval: DEFAULT_TIME,
      limit: STEP,
      displayDatetime: false,
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
      date: dayjs(temp.date),
    }));
  }, [temperature]);

  const graphHumidity = useMemo(() => {
    return humidity?.data?.data?.map((hum) => ({
      humidity: hum.humidityAvg,
      datetime: dayjs(hum.date).format("HH:mm:ss DD.MM.YYYY"),
      date: dayjs(hum.date),
    }));
  }, [humidity]);

  const rows = useMemo(() => {
    return [
      createRow("Maximum temperature", `${temperature?.data?.max ?? "N/A"}°C`),
      createRow("Minimum temperature", `${temperature?.data?.min ?? "N/A"}°C`),
      createRow(
        "Average temperature",
        `${temperature?.data?.average ?? "N/A"}°C`
      ),
      createRow("Maximum humidity", `${humidity?.data?.max ?? "N/A"}%`),
      createRow("Minimum humidity", `${humidity?.data?.min ?? "N/A"}%`),
      createRow("Average humidity", `${humidity?.data?.average ?? "N/A"}%`),
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
            <Box mr="0.5rem">
              <FormControl>
                <InputLabel>Interval</InputLabel>
                <Select
                  value={state.interval}
                  label="Interval"
                  onChange={(val) => {
                    setState({
                      interval: val.target.value,
                      date: state.displayDatetime
                        ? state.date
                        : timerSetter(val.target.value, state.limit),
                    });
                  }}
                >
                  <MenuItem value={TIME_IN_MS.MINUTE}>1 Minute</MenuItem>
                  <MenuItem value={TIME_IN_MS.FIVE_MINUTES}>5 Minutes</MenuItem>
                  <MenuItem value={TIME_IN_MS.TEN_MINUTES}>10 Minutes</MenuItem>
                  <MenuItem value={TIME_IN_MS.HOUR}>1 Hour</MenuItem>
                  <MenuItem value={TIME_IN_MS.DAY}>1 Day</MenuItem>
                  <MenuItem value={TIME_IN_MS.WEEK}>1 Week</MenuItem>
                  <MenuItem value={TIME_IN_MS.MONTH}>1 Month</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box mr="0.5rem">
              <FormControl>
                <InputLabel>Step</InputLabel>
                <Select
                  value={state.limit}
                  label="Step"
                  onChange={(val) => {
                    setState({
                      limit: val.target.value,
                      date: state.displayDatetime
                        ? state.date
                        : timerSetter(state.interval, val.target.value),
                    });
                  }}
                >
                  <MenuItem value={5}>5 records</MenuItem>
                  <MenuItem value={10}>10 records</MenuItem>
                  <MenuItem value={20}>20 records</MenuItem>
                  <MenuItem value={30}>30 records</MenuItem>
                  <MenuItem value={50}>50 records</MenuItem>
                  <MenuItem value={100}>100 records</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.displayDatetime}
                  onChange={(e) => {
                    setState({
                      displayDatetime: e.target.checked,
                      date: e.target.checked
                        ? state.date
                        : timerSetter(state.interval, state.limit),
                    });
                  }}
                />
              }
              label="Set date and time"
            />
          </Box>
          {state.displayDatetime && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex">
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
                  <Box mr="0.5rem">
                    <TimePicker
                      label="Time"
                      value={state.date}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                        />
                      )}
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
                    />
                  </Box>
                )}
              </Box>
            </LocalizationProvider>
          )}
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
                activeDot={{
                  onClick: (e, { payload: { date } }) => {
                    setState({ date, displayDatetime: true });
                  },
                  r: 8,
                }}
                type="monotone"
                dataKey="humidity"
                stroke="#8884d8"
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
              <Line
                activeDot={{
                  onClick: (e, { payload: { date } }) => {
                    setState({ date, displayDatetime: true });
                  },
                }}
                type="monotone"
                dataKey="temperature"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Layout>
  );
};
