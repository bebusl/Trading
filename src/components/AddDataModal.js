import { Button, Modal } from "antd";
import React, { useState } from "react";

function AddDataModal() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => setOpen(true);
  const handleOK = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setModalText("이런 실패했네용.");
      setConfirmLoading(false);
    }, 3000);
  };

  const onAsyncFail = () => {
    setConfirmLoading(false);
  };

  const handleCancle = () => {
    setOpen(false);
    setModalText("Content of the modal");
  };

  return (
    <>
      <Button onClick={showModal}>데이터 추가</Button>
      <Modal
        title="데이터 추가"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancle}
        onOk={handleOK}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default AddDataModal;
