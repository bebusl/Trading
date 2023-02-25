import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../api/authAPI";
import { eraseCookie, getCookie, login, setCookie } from "../../utils";

function Login() {
  const navigate = useNavigate();
  const [isError, setError] = useState(false);
  const savedId = getCookie("id");
  const [isRemembered, setIsRemembered] = useState(!!savedId);

  useEffect(() => {
    if (!isRemembered && !!savedId) removeRememberId();
  }, [isRemembered]);

  const onFinish = async (values) => {
    if (isRemembered) rememberId(values.id);
    try {
      const res = await loginRequest(values);
      if (res.data?.success) {
        login(res.data);
        navigate("/main", {
          state: { companyList: res.data.user.companyList },
        });
      }
    } catch (e) {
      setError(true);
    }
  };

  const rememberId = (id) => setCookie("id", id, 30);

  const removeRememberId = () => eraseCookie("id");

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
          <Form.Item name="id" initialValue={savedId || ""}>
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
          <div style={{ textAlign: "right", paddingBottom: "10px" }}>
            <Checkbox
              checked={isRemembered}
              onChange={(e) => {
                const target = e.target;
                setIsRemembered(target.checked);
              }}
              style={{ textAlign: "right" }}
            >
              아이디 저장
            </Checkbox>
          </div>
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
