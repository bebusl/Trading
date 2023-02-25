import { secureFetch } from "./fetchClient";

export const transactionRequest = (data) => {
  return secureFetch.get("/v1/txs", { params: data });
};

export const dashboardRequest = (data) => {
  return secureFetch.get("/v1/dashboard", { params: { companyName: data } });
};
