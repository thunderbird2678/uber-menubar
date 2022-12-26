import { css, run, React } from "uebersicht";
import * as config from "./config.json";

export const refreshFrequency = 2500;

// get the current screen resolution
const screenWidth = window.screen.width;
const barWidth = screenWidth;

const options = {
  top: "0px",
  left: screenWidth / 2 - barWidth / 2 + "px",
  width: barWidth + "px",

  // Refer to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  timezone: "America/Toronto",
  city: "Toronto",
};

export const command = (dispatch) => {
  run(
    "StatBar.widget/mini-bar-stats.sh " + options.timezone + " " + options.disk
  ).then((output) => {
    // parse the output as JSON
    const stats = JSON.parse(output);
    dispatch({
      type: "UPDATE_STATS",
      data: stats,
    });
  });

  const now = Date.now();
};

export const className = {
  top: options.top,
  left: options.left,
  width: options.width,
  userSelect: "none",

  backgroundColor: "#232634",
  height: "38px",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "flex-end",
  padding: "0 10px 0 0",
  alignItems: "center",
};

const containerClassName = css({
  color: "rgba(255, 255, 255)",
  fontFamily: "JuliaMono",
  fontSize: "9px",
  textAlign: "center",
});

const lavender = css({
  backgroundColor: "#babbf1",
});

const blue = css({
  backgroundColor: "#8caaee	",
});

const sapphire = css({
  backgroundColor: "#85c1dc",
});

const sky = css({
  backgroundColor: "#99d1db",
});

const teal = css({
  backgroundColor: "#81c8be",
});

const green = css({
  backgroundColor: "#a6d189",
});

const metricStyle = css({
  display: "inline-block",
  border: "none",
  padding: "5px 5px",
  borderRadius: "5px",
  color: "#292c3c",
  fontWeight: "600",
});

const metricsStyle = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  gap: "10px",
});

const metricsStyleRow = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  gap: "5px",
});

export const initialState = {
  day: "...",
  month: "...",
  dayNum: "...",
  year: "...",
  time: "...",
  ampm: "...",
  cpuUsage: 0,
  memoryUsage: 0,
  volume: 0,
  wifi: {
    ssid: "N/A",
  },
};

export const updateState = (event, previousState) => {
  if (event.error) {
    return { ...previousState, warning: `We got an error: ${event.error}` };
  }

  if (event.type === "UPDATE_STATS") {
    return {
      ...previousState,
      day: event.data.date_day,
      month: event.data.date_month,
      dayNum: event.data.date_day_num,
      time: event.data.date_time,
      cpuUsage: parseFloat(event.data.cpu_usage).toFixed(2),
      memoryUsage: parseFloat(event.data.mem_usage).toFixed(0),
      volume: event.data.volume,
      wifi: {
        ssid: event.data.ssid,
      },
    };
  }

  return {
    ...previousState,
    warning: false,
  };
};

export const render = ({
  warning,
  day,
  month,
  dayNum,
  time,
  cpuUsage,
  memoryUsage,
  wifi,
  volume,
}) => {
  if (warning) {
    return <div>{warning}</div>;
  }
  return (
    <div className={containerClassName}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
        crossOrigin="anonymous"
      />
      <div className={metricsStyle}>
        <div className={metricsStyleRow}>
          <div className={`${metricStyle} ${green}`}>
            <i className={`fas fa-microchip`}></i> {cpuUsage}%
          </div>
          <div className={`${metricStyle} ${teal}`}>
            <i className={`fas fa-memory`}></i> {memoryUsage}%
          </div>
          <div className={`${metricStyle} ${sky}`}>
            <i className={`fas fa-volume-up`}></i> {volume}%
          </div>
          <div className={`${metricStyle} ${sapphire}`}>
            <i className="fas fa-wifi"></i>
            {wifi.ssid === "" ? " N/A" : <> {wifi.ssid}</>}
          </div>
          <div className={`${metricStyle} ${blue}`}>
            <i className={`far fa-calendar`}></i> {day} {dayNum} {month}
          </div>
          <div className={`${metricStyle} ${lavender}`}>
            <i className={`far fa-clock`}></i> {time}
          </div>
        </div>
      </div>
    </div>
  );
};
