import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { logoff } from "../utils";

function HeaderContent({ isAdmin, children }) {
  const userName = sessionStorage.getItem("userName");
  const handleClickLogoffBtn = useCallback(() => {
    logoff();
    window.location.reload();
  }, []);

  return (
    <>
      <div style={{ fontSize: "1rem" }}>Banking Information</div>
      <div className="list-container">
        {children}

        {isAdmin && (
          <Link to="/admin" style={{ color: "inherit" }}>
            <Button type="text" style={{ color: "white" }}>
              계정추가
            </Button>
          </Link>
        )}

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
