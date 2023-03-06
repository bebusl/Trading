import { secureFetch } from "./fetchClient";

export const addCompanyRequest = ({
  username,
  password,
  companyName,
  feeRate,
}) => {
  return secureFetch.post("/v1/admin/company", {
    username,
    password,
    companyName,
    feeRate,
  });
};

export const addBankData = ({
  txTime,
  bank,
  txType,
  name,
  amount,
  fee,
  balance,
  totalAmount,
  companyName,
}) => {
  return secureFetch.post("/v1/admin/add-data", {
    txTime,
    bank,
    txType,
    name,
    amount,
    fee,
    balance,
    totalAmount,
    companyName,
  });
};
