import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";

const DefaultRouter = () => (
  <Routes>
    <Route path="*" element={<NotFound />} />
    <Route path="/" element={<Navigate to={"login"} />} />
    <Route path="/login" element={<Login />} />
    <Route path="/main" element={<Main />} />
  </Routes>
);

export default DefaultRouter;
