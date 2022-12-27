import { css, run, React } from "uebersicht";
import * as config from "./config.json";

export const refreshFrequency = 1000;

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
    // horrible hack because I can't figure out how to cleanly handle the printf
    let raw = output;
    raw = raw.substring(raw.indexOf("{"), raw.indexOf("}") + 1);
    // parse the output as JSON
    const stats = JSON.parse(raw);
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

  backgroundColor: "transparent",
  height: "56px",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  alignItems: "center",
};

const containerClassName = css({
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
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

const yellow = css({
  backgroundColor: "#e5c890",
});

const peach = css({
  backgroundColor: "#ef9f76",
});

const clickable = css({
  cursor: "pointer",
});

const growable = css({
  flexGrow: "1",
});

const metricStyle = css({
  display: "inline-block",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  color: "#292c3c",
  fontWeight: "800",
  lineHeight: "10px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const metricsStyleRow = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  gap: "5px",
});

const fit = css({
  minWidth: "min-content",
});

export const initialState = {
  day: "...",
  month: "...",
  dayNum: "...",
  year: "...",
  time: "...",
  ampm: "...",
  spotifyStatus: "...",
  spotifyArtist: "...",
  spotifySong: "...",
  battLevel: 0,
  battRemaining: "...",
  battStatus: "...",
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
      spotifyStatus: event.data.spotify_status,
      spotifyArtist: event.data.spotify_artist,
      spotifySong: event.data.spotify_song,
      battLevel: event.data.batt_level,
      battStatus: event.data.batt_status,
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
  battLevel,
  battStatus,
  spotifyStatus,
  spotifySong,
  spotifyArtist,
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
      <div style={{ width: "42.5vw", padding: "24px" }}>
        <div className={metricsStyleRow}>
          <div
            className={`${metricStyle} ${peach} ${growable}`}
            style={{ display: "flex" }}
          >
            <i className="fas fa-headphones" style={{ marginRight: "10px" }} />
            <span
              style={{
                flexGrow: "1",
                minWidth: "0px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginRight: "10px",
              }}
            >
              {spotifyArtist} - {spotifySong}
            </span>
            |
            <span style={{ marginLeft: "10px" }}>
              <i
                className={`${clickable} fas fa-angle-double-left`}
                onClick={() => run("StatBar.widget/spotify/spotify-prev.sh")}
              />{" "}
              {spotifyStatus === "playing" ? (
                <i
                  className={`${clickable} fas fa-pause`}
                  onClick={() => run("StatBar.widget/spotify/spotify-pause.sh")}
                />
              ) : (
                <i
                  className={`${clickable} fas fa-play`}
                  onClick={() => run("StatBar.widget/spotify/spotify-play.sh")}
                />
              )}{" "}
              <i
                className={`${clickable} fas fa-angle-double-right`}
                onClick={() => run("StatBar.widget/spotify/spotify-next.sh")}
              />
            </span>
          </div>
          <div className={`${metricStyle} ${yellow} ${growable} ${fit}`}>
            <i className={`fas fa-microchip`}></i> {cpuUsage}%
          </div>
          <div className={`${metricStyle} ${green} ${growable} ${fit}`}>
            <i className={`fas fa-memory`}></i> {memoryUsage}%
          </div>
          <div className={`${metricStyle} ${teal} ${growable} ${fit}`}>
            <i className={`fas fa-volume-up`}></i> {volume}%
          </div>
          <div className={`${metricStyle} ${sky} ${growable} ${fit}`}>
            <i className="fas fa-wifi"></i>
            {wifi.ssid === "" ? " N/A" : <> {wifi.ssid}</>}
          </div>
          <div className={`${metricStyle} ${sapphire} ${growable} ${fit}`}>
            {battStatus === "charging" ? (
              <i className="fas fa-plug" />
            ) : (
              <i className="fas fa-battery-half" />
            )}{" "}
            {battLevel}%
          </div>
          <div className={`${metricStyle} ${blue} ${growable} ${fit}`}>
            <i className={`far fa-calendar`}></i> {day} {dayNum} {month}
          </div>
          <div className={`${metricStyle} ${lavender} ${growable} ${fit}`}>
            <i className={`far fa-clock`}></i> {time}
          </div>
        </div>
      </div>
    </div>
  );
};
