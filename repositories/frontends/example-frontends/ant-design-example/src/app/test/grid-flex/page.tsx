"use client";

import { Col, Row } from "antd";

export default function Page() {
  return (
    <>
      <Row>
        <Col flex={"2 0"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#ff0" }}>
          2 / 5
        </Col>
        <Col flex={"3 0"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#f00" }}>
          3 / 5
        </Col>
      </Row>
      <Row>
        <Col flex={2} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#ff0" }}>
          23333 / 5
        </Col>
        <Col flex={3} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#f00" }}>
          3 / 5
        </Col>
      </Row>
      <Row>
        <Col flex={"2 0"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#ff0" }}>
          23333 / 5
        </Col>
        <Col flex={"3 0"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#f00" }}>
          3 / 5
        </Col>
      </Row>
    </>
  );
}
