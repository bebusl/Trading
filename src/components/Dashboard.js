import React, { useEffect, useState } from "react";
import { dashboardRequest } from "../api/transactionAPI";
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

function Dashboard(props) {
  const { curCompany } = props;
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
      console.log("GET DASHBOARD", event);
      const data = JSON.parse(event.data);
      // 실시간 업데이트 필터링 company이름은 그냥 전역적으로 관리해야겠네...
      if (data.companyName === curCompany)
        setDashboardInfo((prev) => Object.assign({}, prev, data));
    };

    SSEClient?.addEventListener("dashboard", getRealtimeDashboardData);

    return () => {
      if (SSEClient)
        SSEClient.removeEventListener("dashboard", getRealtimeDashboardData);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboardRequest(curCompany.companyName);
        if (res.data.success) {
          const { success, ...data } = res.data;
          console.log("IM UPDATED", dashboardInfo);
          setDashboardInfo(data);
        }
      } catch (e) {
        console.error("FAILED TO FETCH DASHBOARD DATA");
      }
    })(); //curCompany바뀌면 호출해야 함.
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
