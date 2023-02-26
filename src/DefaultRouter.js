import { Navigate, Route, Routes } from "react-router-dom";
import { SSEContextProvider } from "./context/SSEContext";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";

const DefaultRouter = () => (
  <Routes>
    <Route path="*" element={<NotFound />} />
    <Route path="/" element={<Navigate to={"login"} />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/main"
      element={
        <SSEContextProvider>
          <Main />
        </SSEContextProvider>
      }
    />
  </Routes>
);

export default DefaultRouter;
