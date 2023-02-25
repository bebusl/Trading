import { commonFetch } from "./fetchClient";

export const loginRequest = (data) => {
  return commonFetch.post("/v1/login", {
    username: data.id,
    password: data.password,
  });
};
