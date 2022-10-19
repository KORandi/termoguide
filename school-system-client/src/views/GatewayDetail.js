import { useParams } from "react-router-dom";
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
import { ControlPanel } from "../components/control-panel/ControlPanel";
import { ADMIN } from "../config/roles";
import styled from "styled-components";
import { Grid, Button, Box } from "@mui/material";

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

const GraphWrapper = styled.div`
  height: 500px;
`;

export const GatewayDetail = () => {
  const { id } = useParams();

  return (
    <Layout active="gateways">
      <ControlPanel
        title={"Gateway Detail"}
        id={id}
        page={"gateway"}
        rolesDelete={[ADMIN]}
        onDelete={() => {}}
        rolesEdit={[ADMIN]}
      />
      <Grid container>
        <Grid xs={12}>
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
        <Grid xs={12} height={500}>
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
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Layout>
  );
};
