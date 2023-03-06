import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import dayjs from "dayjs";

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
    valueFormatter: (params) => (params.value === "WITHDRAW" ? "출금" : "입금"),
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

const DepositGrid = ({ rowData, fetchData }) => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "60vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const rowClassRules = useMemo(
    () => ({
      "row-withdraw": (params) =>
        params.api.getValue("txType", params.node) === "WITHDRAW",
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowClassRules={rowClassRules}
          suppressRowClickSelection={true}
          pivotPanelShow={"always"}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default DepositGrid;
