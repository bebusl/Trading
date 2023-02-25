import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../api/authAPI";

function Login() {
  const navigate = useNavigate();
  const [isError, setError] = useState(false);
  const onFinish = async (values) => {
    try {
      const res = await loginRequest(values);
      if (res.data?.success) {
        sessionStorage.setItem("accessToken", "Bearer " + res.data.accessToken);
        sessionStorage.setItem("userName", res.data.user.username);
        sessionStorage.setItem(
          "authority",
          JSON.stringify(res.data.user.authority)
        );
        navigate("/main", {
          state: { companyList: res.data.user.companyList },
        });
      }
    } catch (e) {
      setError(true);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        title="Banking Information"
        style={{ width: "30%", minWidth: "400px", maxWidth: "600px" }}
        headStyle={{ backgroundColor: "#3b404b", color: "white" }}
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: false }}
          onFinish={onFinish}
        >
          <Form.Item name="id">
            <Input prefix={<UserOutlined />} size="large" placeholder="id" />
          </Form.Item>
          <Form.Item name="password">
            <Input
              prefix={<LockOutlined />}
              type="password"
              size="large"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            style={{ textAlign: "right" }}
          >
            <Checkbox>아이디 저장</Checkbox>
          </Form.Item>
          <Form.Item labelAlign="right">
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", backgroundColor: "black" }}
            >
              로그인
            </Button>
          </Form.Item>
          {isError && (
            <p style={{ color: "#c00000", textAlign: "center" }}>
              로그인을 실패했습니다.
            </p>
          )}
        </Form>
      </Card>
    </div>
  );
}

export default Login;
