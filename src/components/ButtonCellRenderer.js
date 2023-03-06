import { Button } from "antd";
import React from "react";

function ButtonCellRenderer(props) {
  const { data, openConfirmModal } = props;
  const btnClickedHandler = () => {
    const { id } = data;
    if (id) openConfirmModal(data);
  };

  return <Button onClick={btnClickedHandler}>삭제</Button>;
}

export default ButtonCellRenderer;
