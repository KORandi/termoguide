import { useMemo } from "react";
import dayjs from "dayjs";
import { TIME_IN_MS } from "../config/constants";
import { useContent } from "./useContent";

function createRow(name, value) {
  return { name, value };
}

function round(num) {
  if (typeof num === "undefined") {
    return;
  }
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
}

export const useGraphData = (state) => {
  const { data: temperature, error: temperatureError } = useContent(
    "gatewayTemperature",
    { ...state, date: state.date.unix() },
    state
  );
  const { data: humidity, error: humidityError } = useContent(
    "gatewayHumidity",
    { ...state, date: state.date.unix() },
    state
  );

  const humidityRows = useMemo(() => {
    if (humidityError) {
      return [];
    }
    return [
      createRow("Maximum humidity", `${round(humidity?.data?.max) ?? "N/A"}%`),
      createRow("Minimum humidity", `${round(humidity?.data?.min) ?? "N/A"}%`),
      createRow(
        "Average humidity",
        `${round(humidity?.data?.average) ?? "N/A"}%`
      ),
      createRow(
        "Humidity variance",
        `${round(humidity?.data?.variance) ?? "N/A"}%`
      ),
      createRow(
        "Humidity coeficient of variation",
        `${round(humidity?.data?.coefficientOfVariation) ?? "N/A"}%`
      ),
    ];
  }, [
    humidity?.data?.average,
    humidity?.data?.coefficientOfVariation,
    humidity?.data?.max,
    humidity?.data?.min,
    humidity?.data?.variance,
    humidityError,
  ]);

  const temperatureRows = useMemo(() => {
    if (temperatureError) {
      return [];
    }
    return [
      createRow(
        "Maximum temperature",
        `${round(temperature?.data?.max) ?? "N/A"}°C`
      ),
      createRow(
        "Minimum temperature",
        `${round(temperature?.data?.min) ?? "N/A"}°C`
      ),
      createRow(
        "Average temperature",
        `${round(temperature?.data?.average) ?? "N/A"}°C`
      ),
      createRow(
        "Temperature variance",
        `${round(temperature?.data?.variance) ?? "N/A"}°C`
      ),
      createRow(
        "Temperature coeficient of variation",
        `${round(temperature?.data?.coefficientOfVariation) ?? "N/A"}%`
      ),
    ];
  }, [
    temperature?.data?.average,
    temperature?.data?.coefficientOfVariation,
    temperature?.data?.max,
    temperature?.data?.min,
    temperature?.data?.variance,
    temperatureError,
  ]);

  const graphTemperature = useMemo(() => {
    if (temperatureError) {
      return [];
    }
    return temperature?.data?.data?.map((temp) => ({
      temperature: round(temp.value),
      datetime: dayjs(temp.date).format(
        state.interval < TIME_IN_MS.DAY ? "DD.MM.YYYY HH:mm:ss" : "DD.MM.YYYY"
      ),
      date: dayjs(temp.date),
    }));
  }, [state.interval, temperature?.data?.data, temperatureError]);

  const graphHumidity = useMemo(() => {
    if (humidityError) {
      return [];
    }
    return humidity?.data?.data?.map((hum) => ({
      humidity: round(hum.value),
      datetime: dayjs(hum.date).format(
        state.interval < TIME_IN_MS.DAY ? "DD.MM.YYYY HH:mm:ss" : "DD.MM.YYYY"
      ),
      date: dayjs(hum.date),
    }));
  }, [humidityError, humidity?.data?.data, state.interval]);

  const isLoading = useMemo(
    () => (!temperature || !humidity) && !temperatureError && !humidityError,
    [humidity, humidityError, temperature, temperatureError]
  );

  return {
    humidityRows,
    temperatureRows,
    graphTemperature,
    graphHumidity,
    isLoading,
  };
};
