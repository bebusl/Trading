import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import dayjs from "dayjs";
import ButtonCellRenderer from "./ButtonCellRenderer";
import { Modal } from "antd";
import { deleteBankData } from "../api/adminAPI";
import ListedData from "./ListedData";

const DepositGrid = ({ rowData, fetchData }) => {
  const [open, setOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(null);

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
    {
      field: "delete",
      headerName: "삭제",
      cellRenderer: ButtonCellRenderer,
      cellRendererParams: {
        openConfirmModal: (data) => {
          setDeleteItem(data);
          setOpen(true);
          setDeleteLoading(false);
          setIsDeleteSuccess(null);
        },
      },
    },
  ];

  const handleOk = () => {
    setDeleteLoading(true);
    (async () => {
      try {
        const res = await deleteBankData(deleteItem.id);
        setDeleteLoading(false);
        if (res.data.success) {
          setIsDeleteSuccess(true);
          setOpen(false);
          fetchData();
        } else setIsDeleteSuccess(false);
      } catch (e) {
        setDeleteLoading(false);
        setIsDeleteSuccess(false);
      }
    })();
  };

  return (
    <div style={containerStyle}>
      <Modal
        title="데이터 삭제"
        open={open}
        onOk={handleOk}
        onCancel={() => {
          setOpen(false);
          setDeleteItem(null);
          setDeleteLoading(false);
          setIsDeleteSuccess(null);
        }}
      >
        <ListedData data={deleteItem} />
        <p>정말 삭제하시겠습니까?</p>
        {isDeleteLoading && <p>삭제 중...</p>}
        {!isDeleteLoading && isDeleteSuccess && (
          <p style={{ color: "green" }}>삭제 성공</p>
        )}
        {!isDeleteLoading && isDeleteSuccess === false && (
          <p style={{ color: "red" }}>삭제 실패</p>
        )}
      </Modal>
      <div style={gridStyle} className="ag-theme-alpine-dark">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowClassRules={rowClassRules}
          suppressScrollOnNewData={true}
          pivotPanelShow={"always"}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default DepositGrid;
