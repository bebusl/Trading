import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, DatePicker, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { connectSSE, rangeFormatter } from "../utils";
import { transactionRequest } from "../api/transactionAPI";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DepositGrid = ({ companyList }) => {
  const [company, setCompany] = useState(companyList[0]);
  const [range, setRange] = useState([]);
  const containerStyle = useMemo(() => ({ width: "100%", height: "60vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const today = useMemo(() => dayjs().format("YYYY MM/DD"), []);
  const [rowData, setRowData] = useState();
  const isToday = useRef(true);
  const eventSource = useRef(null);

  const columnDefs = [
    {
      field: "txTime",
      headerName: "입금시간",
      valueFormatter: (params) =>
        dayjs(new Date(params.value)).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      field: "bank",
      headerName: "은행",
    },
    {
      field: "txType",
      headerName: "이체유형",
      valueFormatter: (params) =>
        params.value === "WITHDRAW" ? "출금" : "입금",
    },
    {
      field: "name",
      headerName: "입/출금자명",
    },
    {
      field: "amount",
      headerName: "입/출금금액",
      valueFormatter: (params) => params.value.toLocaleString(),
    },
    {
      field: "fee",
      headerName: "수수료",
      valueFormatter: (params) => params.value.toLocaleString(),
    },
    {
      field: "balance",
      headerName: "잔금",
      valueFormatter: (params) => params.value.toLocaleString(),
    },
    {
      field: "totalAmount",
      headerName: "잔액",
      valueFormatter: (params) => params.value.toLocaleString(),
    },
  ];

  useEffect(() => {
    eventSource.current = connectSSE();
    eventSource.current.addEventListener("tx", (event) => {
      const data = JSON.parse(event.data);
      console.log("DATA COMMING", isToday.current);
      if (isToday.current) {
        console.log("this is today");
        setRowData((prev) => [data, ...prev]);
      } else {
        console.log("THIS IS FILTER");
      }
    });

    return () => {
      if (eventSource.current) {
        eventSource.current.close();
      }
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const fetchData = async () => {
    const data = {
      companyName: company,
      startDt: range[0] || today + " 00:00",
      endDt: range[1] || today + " 24:00",
    };
    isToday.current = !range[0] && !range[1] ? true : false;
    console.log("필터 적용 중이니?", !isToday.current);
    try {
      const res = await transactionRequest(data);
      if (res.data.success) setRowData(res.data.txs);
    } catch (e) {
      console.error("fetch data error");
    }
  };
  const onGridReady = () => {
    fetchData();
  };

  const onCompanyChange = (value) => {
    console.log("SELECTED COMPANY", value);
    setCompany(value);
  };
  const onRangeChange = (value) => {
    const formedRange = rangeFormatter(value[0], value[1]);
    setRange(formedRange);
  };

  const search = async (e) => {
    e.preventDefault();
    fetchData();
  };
  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <p style={{ fontSize: "18px" }}>입/출금 현황</p>
        <div>
          <Select
            placeholder="회사"
            onChange={onCompanyChange}
            defaultValue={companyList[0]}
          >
            {companyList?.map((company) => (
              <Option value={company} key={company}>
                {company}
              </Option>
            ))}
          </Select>
          <RangePicker
            placeholder={["입금날짜", "입금날짜"]}
            autoFocus={true}
            onChange={onRangeChange}
          />
          <Button icon={<SearchOutlined />} onClick={search}>
            조회
          </Button>
        </div>
      </div>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressRowClickSelection={true}
          pivotPanelShow={"always"}
          pagination={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default DepositGrid;
