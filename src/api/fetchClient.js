import axios from "axios";
import { BASE_URL } from "../constant/url";

function AxiosFactory(config = {}) {
  const baseConfig = {
    baseURL: BASE_URL,
  };
  const axiosInstance = axios.create(Object.assign(baseConfig, config));

  return axiosInstance;
}

export const commonFetch = AxiosFactory();

export const secureFetch = AxiosFactory({
  withCredentials: true,
});

secureFetch.interceptors.request.use((config) => {
  const authToken = sessionStorage.getItem("accessToken");
  if (authToken)
    config.headers = { ...config.headers, Authorization: authToken };
  return config;
});
