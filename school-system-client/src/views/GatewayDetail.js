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
import { useCallback } from "react";
import { useContent, useDeleteContent } from "../hooks/useContent";
import { useReducer } from "react";
import { useGraphData } from "../hooks/useGraphData";
import { TIME_IN_MS } from "../config/constants";
import { timerSetter } from "../utils/helpers";

export const GatewayDetail = () => {
  const { id } = useParams();
  const [state, setState] = useReducer(
    (prevState, currState) => ({ ...prevState, ...currState }),
    {
      date: timerSetter(TIME_IN_MS.HOUR, 30),
      interval: TIME_IN_MS.HOUR,
      limit: 30,
      displayDatetime: false,
      gatewayId: id,
    }
  );
  const {
    humidityRows,
    temperatureRows,
    graphTemperature,
    graphHumidity,
    isLoading,
  } = useGraphData(state);
  const { data: gatewayMeta } = useContent("gateway", id);

  const remove = useDeleteContent("gateway", id);
  const navigate = useNavigate();
  const deleteGateway = useCallback(async () => {
    if (!(await remove())) return;
    navigate("/app/gateways");
  }, [navigate, remove]);

  return (
    <Layout isLoading={isLoading} active="gateways">
      <ControlPanel
        title={gatewayMeta?.data?.name ?? "Gateway detail"}
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
        <Grid mb="1rem" mt="2rem" item xs={12}>
          <h3 style={{ textAlign: "center" }}>Temperature</h3>
        </Grid>
        <Grid item xs={12} height={500}>
          {!graphTemperature?.length && <span>Data are not available</span>}
          {!!graphTemperature?.length && (
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
                  tickFormatter={(tick) => `${tick}??C`}
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
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
                {temperatureRows.map((row) => (
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
          {!graphHumidity?.length && <span>Data are not available</span>}
          {!!graphHumidity?.length && (
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
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
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
                {humidityRows.map((row) => (
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
      </Grid>
    </Layout>
  );
};
