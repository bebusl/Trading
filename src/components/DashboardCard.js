import { HeartOutlined, LinkOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";

const DashboardCard = ({ title, value, today = false }) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={today ? <HeartOutlined /> : <LinkOutlined />}
      />
    </Card>
  );
};

export default DashboardCard;
