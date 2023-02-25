import dayjs from "dayjs";
import { EventSourcePolyfill } from "event-source-polyfill";
import { BASE_URL } from "./constant/url";

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
  if (!accessToken) return null;
  const eventSource = new EventSourcePolyfill(BASE_URL + "/v1/subscribe", {
    withCredentials: true,
    headers: {
      Authorization: accessToken,
    },
    heartbeatTimeout: 45000 * 6,
  });

  eventSource.onopen = (e) => {
    console.log("CONNECTED");
  };

  return eventSource;
}

export function login(data) {
  sessionStorage.setItem("accessToken", "Bearer " + data.accessToken);
  sessionStorage.setItem("userName", data.user.username);
  sessionStorage.setItem("authority", JSON.stringify(data.user.authority));
}

export function logoff() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("authority");
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
/**
 * "{"bank":"KB","txType":"DEPOSIT","name":"윤정환\r","amount":15000000,"fee":180000,"totalAmount":5300000,"txTime":"2023-02-25T21:51:00"}"
 */
