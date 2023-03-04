import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback } from "react";
import { Navigate } from "react-router-dom";
import { logoff } from "../utils";

function HeaderContent() {
  const userName = sessionStorage.getItem("userName");

  const handleClickLogoffBtn = useCallback(() => {
    logoff();
  }, []);

  if (!userName) {
    window.alert("로그아웃 되었습니다.");
    return <Navigate to="/login"></Navigate>;
  }
  return (
    <>
      <div style={{ fontSize: "1rem" }}>Banking Information</div>
      <div className="list-container">
        <div>{userName}님</div>
        <div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{ color: "white" }}
            onClick={handleClickLogoffBtn}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </>
  );
}

export default HeaderContent;
