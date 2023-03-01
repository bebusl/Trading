import { secureFetch } from "./fetchClient";

export const addCompanyRequest = ({
  username,
  password,
  companyName,
  feeRate,
}) => {
  return secureFetch.get("/v1/admin/company", {
    username,
    password,
    companyName,
    feeRate,
  });
};
