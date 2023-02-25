import React, { useEffect, useState } from "react";
import DepositGrid from "../../components/DepositGrid";
import { Button, Card, Layout, Space, Statistic } from "antd";
import { LinkOutlined, LogoutOutlined } from "@ant-design/icons";
import { Navigate, useLocation } from "react-router-dom";
import { dashboardRequest } from "../../api/transactionAPI";
import { logoff } from "../../utils";
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
};

const CustomCard = ({
  title = "title",
  value = 1000000000,
  icon = { LinkOutlined },
}) => (
  <Card>
    <Statistic title={title} value={value} prefix={<LinkOutlined />} />
  </Card>
);

function Main() {
  const location = useLocation();
  const companyList = location.state?.companyList || [];

  const userName = sessionStorage.getItem("userName");

  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboardRequest(companyList[0]);
        if (res.data.success) {
          const { success, ...data } = res.data;
          setDashboard(data);
        }
      } catch (e) {
        console.error("FAILED TO FETCH DASHBOARD DATA");
      }
    })();
  }, []);

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
              onClick={logoff}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </Header>
      <Content style={contentStyle}>
        <Space direction="vertical" style={{ width: "100%" }} size={[0, 100]}>
          <div className="card-container">
            <CustomCard
              title="전날 입금 총액"
              value={dashboard.ytotalDeposit}
            />
            <CustomCard
              title="전날 출금 총액"
              value={dashboard.ytotalWithdraw}
            />
            <CustomCard title="전날 수수료 총액" value={dashboard.ytotalFee} />
            <CustomCard
              title="전날 잔금 총액"
              value={dashboard.ytotalBalance}
            />
            <CustomCard title="금일 입금 총액" value={dashboard.totalDeposit} />
            <CustomCard
              title="금일 출금 총액"
              value={dashboard.totalWithdraw}
            />
            <CustomCard title="금일 수수료 총액" value={dashboard.totalFee} />
            <CustomCard title="금일 잔금 총액" value={dashboard.totalBalance} />
          </div>

          <DepositGrid companyList={companyList} />
        </Space>
      </Content>
    </Layout>
  );
}

export default Main;
