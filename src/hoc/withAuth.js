import React from "react";
import { Navigate } from "react-router-dom";
import { ROLE_ADMIN } from "../constant/role";

const withAuth = (WrappedComponent) => {
  function AuthenticatedComponent(props) {
    const isAdmin = JSON.parse(sessionStorage.getItem("authority"))?.includes(
      ROLE_ADMIN
    );
    const isLogin = sessionStorage.getItem("accessToken");

    if (!isLogin) {
      window.alert("로그인이 필요합니다.");
      return <Navigate to="/login" />;
    }
    return <WrappedComponent {...props} isAdmin={isAdmin} />;
  }
  AuthenticatedComponent.displayName = "authenticated-";
  return AuthenticatedComponent;
};

export default withAuth;
