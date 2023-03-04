import React, { useMemo, useState } from "react";
import { rangeFormatter } from "../utils";

export const FilterContext = React.createContext();

export const FilterContextProvider = ({ children }) => {
  const companyList = useMemo(
    () => JSON.parse(sessionStorage.getItem("companyList")) || [],
    []
  );

  const feeRate = useMemo(
    () =>
      companyList.reduce((accum, cur) => {
        accum[cur.companyName] = cur.feeRate;
        return accum;
      }, {}),
    []
  );

  const [curCompany, setCurCompany] = useState(companyList[0]);
  const [dateRange, setDateRange] = useState([]);

  const updateCurCompany = (data) => {
    if (typeof data === "string")
      data = { companyName: data, feeRate: feeRate[data] };

    setCurCompany(data);
  };

  const updateDateRange = (value) => {
    const formedRange = rangeFormatter(value[0], value[1]);
    setDateRange(formedRange);
  };

  const value = {
    companyList,
    curCompany,
    updateCurCompany,
    dateRange,
    updateDateRange,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilterState = () => React.useContext(FilterContext);
