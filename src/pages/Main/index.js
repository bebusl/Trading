import React, { useEffect, useState, useMemo, useCallback } from "react";
import DepositGrid from "../../components/DepositGrid";
import { Button, Card, Layout, Space, Statistic } from "antd";
import { LinkOutlined, LogoutOutlined, HeartOutlined } from "@ant-design/icons";
import { Navigate, useLocation } from "react-router-dom";
import { dashboardRequest } from "../../api/transactionAPI";
import { logoff } from "../../utils";
import { useSSEState } from "../../context/SSEContext";
const { Header, Content } = Layout;

const headerStyle = {
  textAlign: "left",
  color: "white",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};
const contentStyle = {
  textAlign: "center",
  padding: "2rem",
  minHeight: "calc( 100vh - 64px )",
};

const CustomCard = ({ title = "title", value = 1000000000, today = false }) => (
  <Card>
    <Statistic
      title={title}
      value={value}
      prefix={today ? <HeartOutlined /> : <LinkOutlined />}
    />
  </Card>
);

function Main() {
  const location = useLocation();
  const companyList = location.state?.companyList || [];
  const isMobile = useMemo(() => window.matchMedia("(max-width: 600px)"), []);

  const userName = sessionStorage.getItem("userName");

  const [dashboard, setDashboard] = useState({});
  const { SSEClient } = useSSEState();

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboardRequest(companyList[0].companyName);
        if (res.data.success) {
          const { success, ...data } = res.data;
          setDashboard(data);
        }
      } catch (e) {
        console.error("FAILED TO FETCH DASHBOARD DATA");
      }
    })();

    const updateDashboardData = (event) => {
      console.log("GET DASHBOARD", event);
      const data = JSON.parse(event.data);
      // 실시간 업데이트 필터링 company이름은 그냥 전역적으로 관리해야겠네...
      setDashboard((prev) => Object.assign({}, prev, data));
    };

    SSEClient?.addEventListener("dashboard", updateDashboardData);

    return () => {
      if (SSEClient)
        SSEClient.removeEventListener("dashboard", updateDashboardData);
    };
  }, []);

  const updateDashboard = useCallback(async (company) => {
    try {
      const res = await dashboardRequest(company);
      if (res.data.success) {
        const { success, ...data } = res.data;
        setDashboard(data);
      }
    } catch (e) {
      console.error("FAILED TO FETCH DASHBOARD DATA");
    }
  }, []);

  const handleClickLogoffBtn = () => {
    logoff();
    setDashboard({});
  };

  if (!userName) {
    window.alert("로그아웃 되었습니다.");
    return <Navigate to="/login"></Navigate>;
  }

  return (
    <Layout>
      <Header style={headerStyle}>
        <div style={{ fontSize: "1rem" }}>Banking Information</div>
        <div className="list-container">
          <div>{userName}님</div>
          <div>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              style={{ color: "white" }}
              onClick={handleClickLogoffBtn}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </Header>
      <Content style={contentStyle}>
        <Space
          direction="vertical"
          style={{ width: "100%" }}
          size={isMobile ? [0, 30] : [0, 100]}
        >
          <div className="card-container">
            <div className="card-wrapper">
              <CustomCard
                title="전날 입금 총액"
                value={dashboard.ytotalDeposit}
              />
              <CustomCard
                title="전날 출금 총액"
                value={dashboard.ytotalWithdraw}
              />
              <CustomCard
                title="전날 수수료 총액"
                value={dashboard.ytotalFee}
              />
              <CustomCard
                title="전날 잔금 총액"
                value={dashboard.ytotalBalance}
              />
            </div>
            <div className="card-wrapper">
              <CustomCard
                title="금일 입금 총액"
                value={dashboard.totalDeposit}
                today={true}
              />
              <CustomCard
                title="금일 출금 총액"
                value={dashboard.totalWithdraw}
                today={true}
              />
              <CustomCard
                title="금일 수수료 총액"
                value={dashboard.totalFee}
                today={true}
              />
              <CustomCard
                title="금일 잔금 총액"
                value={dashboard.totalBalance}
                today={true}
              />
            </div>
          </div>

          <DepositGrid
            companyList={companyList}
            updateDashboard={updateDashboard}
          />
        </Space>
      </Content>
    </Layout>
  );
}

export default Main;
