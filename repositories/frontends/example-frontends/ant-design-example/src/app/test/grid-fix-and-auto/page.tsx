"use client";

import { Col, Row } from "antd";

export default function Page() {
  return (
    <>
      <Row>
        <Col flex={"120px"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#ff0" }}>
          left area
        </Col>
        <Col flex={"auto"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#f00" }}>
          right area
        </Col>
      </Row>
      <Row>
        <Col flex={"120px"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#ff0" }}>
          left area... ... ...
        </Col>
        <Col flex={"auto"} style={{ backgroundClip: "content-box", boxSizing: "initial", backgroundColor: "#f00" }}>
          right area
        </Col>
      </Row>
    </>
  );
}
