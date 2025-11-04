import React from "react";
import { Button, Modal, Row } from "antd";

function ErrorModal({ title, visible, setVisible }) {
  return (
    <div>
      <Modal footer={false} centered wrapClassName="errorModal" open={visible} closeIcon={false}>
        <div>
          <Row justify={"center"} className="title">
            {title}
          </Row>
          <Row justify={"center"}>
            <Button className="btn" onClick={() => setVisible(false)}>
              Okay
            </Button>
          </Row>
        </div>
      </Modal>
    </div>
  );
}

export default ErrorModal;
