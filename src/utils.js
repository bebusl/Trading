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

/**
 * "{"bank":"KB","txType":"DEPOSIT","name":"윤정환\r","amount":15000000,"fee":180000,"totalAmount":5300000,"txTime":"2023-02-25T21:51:00"}"
 */
