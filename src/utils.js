import dayjs from "dayjs";
import { EventSourcePolyfill } from "event-source-polyfill";
import { SSE_BASE_URL } from "./constant/url";

export function rangeFormatter(start, end) {
  const format = "YYYY MM/DD";
  const startSuffix = " 00:00";
  const endSuffix = " 24:00";
  const startDate = dayjs(new Date(start)).format(format);
  const endDate = dayjs(new Date(end)).format(format);

  return [startDate + startSuffix, endDate + endSuffix];
}

export function connectSSE() {
  const accessToken = sessionStorage.getItem("accessToken");
  let retryTime = 0;
  if (!accessToken) return null;
  const eventSource = new EventSourcePolyfill(SSE_BASE_URL, {
    withCredentials: true,
    headers: {
      Authorization: accessToken,
    },
    heartbeatTimeout: 45000 * 6,
  });

  eventSource.onopen = (e) => {
    console.log("CONNECTED");
  };

  eventSource.onerror = () => {
    if (retryTime > 2) {
      console.log("OVER 2TIMEs");
      //eventSource.close();
    }
    retryTime++;
  };

  return eventSource;
}

export function login(data) {
  sessionStorage.setItem("accessToken", "Bearer " + data.accessToken);
  sessionStorage.setItem("userName", data.user.username);
  sessionStorage.setItem("authority", JSON.stringify(data.user.authority));
  sessionStorage.setItem("companyList", JSON.stringify(data.user.companyList));
}

export function logoff() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("authority");
  sessionStorage.removeItem("companyList");
}

export function getUser() {
  const userName = sessionStorage.getItem("userName");
  const accessToken = sessionStorage.getItem("accessToken");
  const authority = JSON.parse(sessionStorage.getItem("authority"));
  return { userName, accessToken, authority };
}

export function setCookie(name, value, expire) {
  const today = new Date();
  today.setDate(today.getDate() + expire);
  document.cookie = `${name}=${value}; path=/; expires=${today.toUTCString()};`;
}

export function getCookie(name) {
  const cookie = document.cookie;
  let matches = cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function eraseCookie(name) {
  document.cookie = name + "=;path=/; Max-Age=-99999999;";
}
