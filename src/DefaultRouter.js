import { Navigate, Route, Routes } from "react-router-dom";
import { FilterContextProvider } from "./context/FilterContext";
import { SSEContextProvider } from "./context/SSEContext";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Main from "./pages/Main";
import withAuth from "./hoc/withAuth";
import Admin from "./pages/Admin";

const MainWithAuth = withAuth(Main);
const AdminWithAuth = withAuth(Admin);

const DefaultRouter = () => (
  <Routes>
    <Route path="*" element={<NotFound />} />
    <Route path="/" element={<Navigate to={"login"} />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/main"
      element={
        <SSEContextProvider>
          <FilterContextProvider>
            <MainWithAuth />
          </FilterContextProvider>
        </SSEContextProvider>
      }
    />
    <Route path="/admin" element={<AdminWithAuth />} />
  </Routes>
);

export default DefaultRouter;
