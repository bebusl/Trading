import React, { useEffect, useState } from "react";
import { dashboardRequest } from "../api/transactionAPI";
import { useFilterState } from "../context/FilterContext";
import { useSSEState } from "../context/SSEContext";
import DashboardCard from "./DashboardCard";

const yTitleMapper = {
  ytotalDeposit: "전날 입금 총액",
  ytotalWithdraw: "전날 출금 총액",
  ytotalFee: "전날 수수료 총액",
  ytotalBalance: "전날 잔금 총액",
};

const tTitleMapper = {
  totalDeposit: "금일 입금 총액",
  totalWithdraw: "금일 출금 총액",
  totalFee: "금일 수수료 총액",
  totalBalance: "금일 잔금 총액",
};

const yElementKeys = Object.keys(yTitleMapper);
const tElementKeys = Object.keys(tTitleMapper);

function Dashboard() {
  const { curCompany } = useFilterState();
  const [dashboardInfo, setDashboardInfo] = useState({
    ytotalDeposit: 0,
    ytotalWithdraw: 0,
    ytotalFee: 0,
    ytotalBalance: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    totalFee: 0,
    totalBalance: 0,
  });

  const { SSEClient } = useSSEState();

  useEffect(() => {
    const getRealtimeDashboardData = (event) => {
      const data = JSON.parse(event.data);
      console.log("GET DASHBOARD", data.companyName);

      if (data.companyName === curCompany.companyName)
        setDashboardInfo((prev) => Object.assign({}, prev, data));
    };

    /**temp block */
    SSEClient?.addEventListener("dashboard", getRealtimeDashboardData);

    return () => {
      if (SSEClient)
        SSEClient.removeEventListener("dashboard", getRealtimeDashboardData);
    };
  }, [curCompany]);

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboardRequest(curCompany.companyName);
        if (res.data.success) {
          const { success, ...data } = res.data;
          setDashboardInfo(data);
        }
      } catch (e) {
        console.error("FAILED TO FETCH DASHBOARD DATA");
      }
    })();
  }, [curCompany]);

  return (
    <div className="card-container">
      <div className="card-wrapper">
        {yElementKeys.map((key) => (
          <DashboardCard
            title={yTitleMapper[key]}
            key={key}
            value={dashboardInfo[key]}
          />
        ))}
      </div>
      <div className="card-wrapper">
        {tElementKeys.map((key) => (
          <DashboardCard
            title={tTitleMapper[key]}
            key={key}
            value={dashboardInfo[key]}
            today={true}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
