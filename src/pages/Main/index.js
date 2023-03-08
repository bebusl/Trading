import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import DepositGrid from "../../components/DepositGrid";
import { Button, Layout, Space, notification } from "antd";
import { useSSEState } from "../../context/SSEContext";
import Dashboard from "../../components/Dashboard";
import Filter from "../../components/Filter";
import HeaderContent from "../../components/HeaderContent";
import dayjs from "dayjs";
import { useFilterState } from "../../context/FilterContext";
import { transactionRequest } from "../../api/transactionAPI";
import AddDataModal from "../../components/AddDataModal";
import createXml from "../../createXml";
import useSound from "use-sound";
import dingdongSound from "./alarmsound.mp3";
const { Header, Content } = Layout;

const headerStyle = {
  textAlign: "left",
  color: "white",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  background: "#4c5667",
};
const contentStyle = {
  textAlign: "center",
  padding: "2rem",
  minHeight: "calc( 100vh - 64px )",
  background: "#475060",
};

function Main({ isAdmin }) {
  const [rowData, setRowData] = useState([]);
  const [play] = useSound(dingdongSound, { volume: 0.5 });
  const playRef = useRef(null);
  const isMobile = useMemo(() => window.matchMedia("(max-width: 600px)"), []);
  const today = useMemo(() => dayjs().format("YYYY MM/DD"), []);
  const isToday = useRef(true);

  const { SSEClient } = useSSEState();
  const { curCompany, dateRange } = useFilterState();

  const fetchGridRowData = useCallback(async () => {
    const data = {
      companyName: curCompany.companyName,
      startDt: dateRange[0] || today + " 00:00",
      endDt: dateRange[1] || today + " 24:00",
    };
    isToday.current = !dateRange[0] && !dateRange[1] ? true : false;
    try {
      const res = await transactionRequest(data);
      if (res.data.success) setRowData(res.data.txs);
    } catch (e) {
      console.error("fetch data error");
    }
  }, [curCompany, dateRange, today]);

  const updateRowData = useCallback(
    (event) => {
      const data = JSON.parse(event.data);
      console.log(
        `CUR ::: ${curCompany.companyName} || receive data::: ${data.companyName}`
      );

      playRef.current?.click();
      notification.open({
        message: "실시간 데이터 알림",
        description: `${data.companyName}에 입/출금 내역이 추가되었습니다`,
        duration: 5,
      });

      if (isToday.current && curCompany.companyName === data.companyName) {
        setRowData((prev) => [data, ...prev]);
      }
    },
    [curCompany]
  );

  useEffect(() => {
    fetchGridRowData();

    //**temp */
    SSEClient.addEventListener("tx", updateRowData);

    return () => {
      if (SSEClient) {
        SSEClient.removeEventListener("tx", updateRowData);
      }
    };
  }, [curCompany]);

  return (
    <Layout>
      <Header style={headerStyle}>
        <HeaderContent isAdmin={isAdmin} />
      </Header>
      <Content style={contentStyle}>
        <button ref={playRef} onClick={play} style={{ display: "none" }} />
        <Space
          direction="vertical"
          style={{ width: "100%" }}
          size={isMobile ? [0, 30] : [0, 100]}
        >
          <Dashboard />
          <h2 style={{ textAlign: "left" }}>입/출금 현황</h2>
          <div style={{ display: "flex", justifyContent: "end" }}>
            {isAdmin && <AddDataModal fetchData={fetchGridRowData} />}
            <Button onClick={() => createXml(rowData)}>엑셀 다운로드</Button>
          </div>
          <Filter fetchData={fetchGridRowData} />
          <DepositGrid rowData={rowData} fetchData={fetchGridRowData} />
        </Space>
      </Content>
    </Layout>
  );
}

export default Main;
