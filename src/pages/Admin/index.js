import { Button, Card, Form, Input } from "antd";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { addCompanyRequest } from "../../api/adminAPI";

const SUCCESS = "SUCCESS";
const FAIL = "FAIL";
const NONE = null;

function Admin({ isAdmin }) {
  const [createStatus, setCreateStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pendingData = () => {
    setIsLoading(true);
    setCreateStatus(NONE);
  };
  const onFinish = (value) => {
    console.log("VALUE", value);
    pendingData();
    (async () => {
      try {
        const res = await addCompanyRequest(value);
        console.log("응답", res);
        setIsLoading(false);
        if (res.data.success === false) setCreateStatus(FAIL);
        else setCreateStatus(SUCCESS);
      } catch (e) {
        setIsLoading(false);
        setCreateStatus(FAIL);
      }
    })();
  };

  if (!isAdmin) {
    window.alert("관리자 권한이 필요한 페이지입니다.");
    return <Navigate to={"/login"} />;
  }
  // username, password, companyName, feeRate;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        title="계정 추가"
        style={{ width: "80vw", minWidth: "400px", maxWidth: "800px" }}
        headStyle={{ backgroundColor: "#3b404b", color: "white" }}
      >
        <Form
          name="add-user"
          initialValues={{ remember: false }}
          onFinish={onFinish}
        >
          <Form.Item name="username">
            <Input size="large" addonBefore="ID" />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password
              type="password"
              size="large"
              addonBefore="비밀번호"
            />
          </Form.Item>
          <Form.Item name="feeRate">
            <Input type="number" size="large" addonBefore="수수료율" />
          </Form.Item>
          <Form.Item name="companyName">
            <Input size="large" addonBefore="회사이름" />
          </Form.Item>

          <Form.Item labelAlign="right">
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", backgroundColor: "black" }}
            >
              계정 생성
            </Button>
          </Form.Item>
        </Form>
        {isLoading && <p>계정 생성 중..</p>}
        {createStatus === SUCCESS && (
          <p style={{ color: "green" }}>계정 생성에 성공했습니다</p>
        )}
        {createStatus === FAIL && (
          <p style={{ color: "red" }}>계정 생성에 실패했습니다</p>
        )}
        <Link to={-1}>이전 페이지로</Link>
      </Card>
    </div>
  );
}

export default Admin;
