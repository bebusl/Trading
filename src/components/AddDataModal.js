import {
  Button,
  Form,
  Input,
  Modal,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import React, { useState, useRef, useMemo } from "react";
import { useFilterState } from "../context/FilterContext";

const initialField = {
  txTime: undefined,
  bank: undefined,
  txType: undefined,
  name: undefined,
  amount: undefined,
  fee: undefined,
  balance: undefined,
  totalAmount: undefined,
  companyName: undefined,
};

const currencyField = (fieldName) => (
  <InputNumber
    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    parser={(value) => {
      const removeComma = value.replace(/\$\s?|(,*)/g, "");
      return +removeComma;
    }}
    addonBefore={fieldName}
    addonAfter={"원"}
    width={"100%"}
  />
);

function AddDataModal() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const formRef = useRef(null);
  const { companyList } = useFilterState();

  const columns = useMemo(() => {
    return [
      {
        field: "txTime",
        headerName: "입금시간",
        component: <DatePicker showTime name="txTime" placeholder="입금시간" />,
      },
      {
        field: "bank",
        headerName: "은행",
      },
      {
        field: "txType",
        headerName: "이체유형",
        component: (
          <Select name="txType" placeholder="이체유형">
            {[
              { value: "DEPOSIT", label: "입금" },
              { value: "WITHDRAW", label: "출금" },
            ].map((data) => (
              <Select.Option value={data.value} key={data.value}>
                {data.label}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        field: "name",
        headerName: "입/출금자명",
      },
      {
        field: "amount",
        headerName: "입/출금금액",
        type: "number",
        component: currencyField("입/출금금액"),
      },
      {
        field: "fee",
        headerName: "수수료",
        type: "number",
        component: currencyField("수수료"),
      },
      {
        field: "balance",
        headerName: "잔금",
        type: "number",
        component: currencyField("잔금"),
      },
      {
        field: "totalAmount",
        headerName: "잔액",
        type: "number",
        component: currencyField("잔액"),
      },
      {
        field: "companyName",
        headerName: "회사이름",
        component: (
          <Select name="companyName" placeholder="회사">
            {companyList.map(({ companyName }, idx) => (
              <Select.Option value={companyName} key={idx}>
                {companyName}
              </Select.Option>
            ))}
          </Select>
        ),
      },
    ];
  }, [companyList]);

  const showModal = () => setOpen(true);

  const handleOK = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 3000);
  };

  const resetForm = () => {
    formRef.current.setFieldsValue(initialField);
    console.log(formRef.current);
  };
  const onAsyncFail = () => {
    setConfirmLoading(false);
  };

  const onFinish = (value) => {
    //console.log(value, value.length); //txTime은 Date객체로 꼭 바꿔줘야함.~
    const formedValue = Object.assign(value, {
      txTime: dayjs(new Date(value.txTime)).format("YYYY-MM-DD HH:mm"),
    });
    console.log(formedValue);
  };

  const handleCancle = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <>
      <Button onClick={showModal}>데이터 추가</Button>
      <Modal
        title="데이터 추가"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancle}
        onOk={handleOK}
        footer={[<Button onClick={resetForm}>초기화</Button>]}
      >
        <Form
          name="add-user"
          initialValues={{ remember: false }}
          onFinish={onFinish}
          ref={formRef}
        >
          {columns.map((column) => (
            <Form.Item name={column.field} key={column.field}>
              {column.component || (
                <Input
                  type={column.type || "text"}
                  addonBefore={column.headerName}
                />
              )}
            </Form.Item>
          ))}

          <Form.Item labelAlign="right">
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", backgroundColor: "black" }}
            >
              데이터 추가
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddDataModal;
