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
import { addBankData } from "../api/adminAPI";
import { useFilterState } from "../context/FilterContext";
import options from "../options.json";

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

const { banks } = options;

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

function AddDataModal({ fetchData }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
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
        component: (
          <Select name="bank" placeholder="은행">
            {banks.map((bank) => (
              <Select.Option value={bank} key={`bank-${bank}`}>
                {bank}
              </Select.Option>
            ))}
          </Select>
        ),
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
              <Select.Option value={data.value} key={`select-${data.value}`}>
                {data.label}
              </Select.Option>
            ))}
          </Select>
        ),
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
        field: "totalAmount",
        headerName: "잔액",
        type: "number",
        component: currencyField("잔액"),
      },
    ];
  }, [companyList]);

  const showModal = () => setOpen(true);

  const resetForm = () => {
    formRef.current.setFieldsValue(initialField);
    setIsLoading(false);
    setIsSuccess(null);
  };

  const onFinish = async (value) => {
    const formedValue = Object.assign(value, {
      txTime: dayjs(new Date(value.txTime)).format("YYYY-MM-DD HH:mm"),
    });
    try {
      const res = await addBankData(formedValue);
      if (res.data.success) {
        setIsSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          resetForm();
          setOpen(false);
          fetchData();
        }, 3000);
      }
    } catch (e) {
      setIsSuccess(false);
      setIsLoading(false);
    }
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
        onCancel={handleCancle}
        footer={[<Button onClick={resetForm}>초기화</Button>]}
      >
        <Form
          name="add-user"
          initialValues={{ remember: false }}
          onFinish={onFinish}
          ref={formRef}
        >
          {columns.map((column) => (
            <Form.Item name={column.field} key={`input-${column.field}`}>
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
        {isLoading && <p>데이터 추가 중...</p>}
        {!isLoading && isSuccess && (
          <p style={{ color: "green" }}>데이터를 추가했습니다.</p>
        )}
        {!isLoading && isSuccess === false && (
          <p style={{ color: "red" }}>데이터 추가를 실패했습니다.</p>
        )}
      </Modal>
    </>
  );
}

export default AddDataModal;
