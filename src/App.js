import "antd/dist/reset.css";
import { ConfigProvider, theme } from "antd";
import { customTheme } from "./style/theme";
import "./style/App.css";

import DefaultRouter from "./DefaultRouter";

const { darkAlgorithm } = theme;

function App() {
  return (
    <ConfigProvider
      theme={{
        ...customTheme,
        algorithm: darkAlgorithm,
      }}
    >
      <DefaultRouter />
    </ConfigProvider>
  );
}

export default App;
