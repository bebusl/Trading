import "antd/dist/reset.css";
import { ConfigProvider, theme } from "antd";
import { customTheme } from "./style/theme";
import "./App.css";

import DefaultRouter from "./DefaultRouter";

const { defaultAlgorithm } = theme;

function App() {
  return (
    <ConfigProvider
      theme={{
        ...customTheme,
        algorithm: defaultAlgorithm,
      }}
    >
      <DefaultRouter />
    </ConfigProvider>
  );
}

export default App;
