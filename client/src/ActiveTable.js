import React, { useRef, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ActiveTable({ data, activeEx, cActiveEx, schedule }) {
  const calculateDate = (date) => {
    return `Week ${
      date % 5 == 0 ? date / 5 : (date - (date % 5)) / 5 + 1
    }, Day ${date % 5 ? date % 5 : 5} `;
  };

  const parentRef = useRef(null);
  const childRef = useRef(null);

  const [scrolled, cScrolled] = useState(true);
  const completed = {
    border: "solid 1px #00FF0020",
    backgroundColor: "#00FF0010",
  };
  const active = { border: "solid 1px orange" };
  const increase = {
    backgroundColor: "none",
    border: "1px solid white",
    boxSizing: "border-box",
    MozBoxSizing: "border-box",
    WebkitBoxSizing: "border-box",
  };

  const extractWeight = (w) => {
    let num = w
      .split("")
      .filter((p) => !isNaN(p))
      .join("");
    if (!w) {
      return "-";
    }
    if (w.includes("lb")) {
      return `${(num / 2.205).toFixed(1)}/${num}`;
    }
    if (w.includes("/")) {
      let kg = w.split("/")[0];
      return `${kg}/${(kg * 2.205).toFixed(1)}`;
    } else {
      return `${num}/${(num * 2.205).toFixed(1)}`;
    }
  };
  return (
    <div className="activeTableContainer">
      <Row className="bannerRow">
        <Col>{data?.focus}</Col>
        <Col>{calculateDate(data?.day)}</Col>
      </Row>
      <Row className="headerRow">
        <Col xs={4}>Exercise</Col>
        <Col xs={1}>Wu</Col>
        <Col xs={3}>SetsxReps</Col>
        <Col xs={2}>%</Col>
        <Col xs={2}>kg/lb</Col>
      </Row>
      {parentRef.current?.clientHeight < childRef.current?.clientHeight &&
      !scrolled ? (
        <div className="upArrow"></div>
      ) : null}
      <div
        className="activeTableScrollContainer"
        ref={parentRef}
        onScroll={() => {
          cScrolled(childRef.current.getBoundingClientRect()["y"] > 80);
        }}
      >
        <div className="activeScrollChild" ref={childRef}>
          {data?.exercises?.map((v, i) => {
            let { name, notes, percentage, reps, sets, warmup, weight } = v;
            let prev = schedule.filter((v) => v.day == data?.day - 5);
            prev = prev[0]?.exercises.filter((v) => v.name == name)[0];
            let prevNum = !prev?.percentage.includes("%")
              ? prev?.percentage.slice(3)
              : prev?.percentage.slice(0, -1);
            let currNum = !percentage.includes("%")
              ? percentage.slice(3)
              : percentage.slice(0, -1);
            return (
              <React.Fragment key={i}>
                <Row
                  className={"activeExercisesRow"}
                  onClick={() => {
                    if (name === activeEx?.name) {
                      cActiveEx({});
                    } else {
                      cActiveEx({ name: name, ...v });
                    }
                  }}
                  style={
                    name === activeEx?.name
                      ? { ...active }
                      : weight
                      ? { ...completed }
                      : { border: "solid 1px #2c3034" }
                  }
                >
                  <Col className="td" xs={4}>
                    {name}
                  </Col>
                  <Col xs={1}>{warmup}</Col>
                  <Col xs={3}>{`${sets} x ${reps}`}</Col>
                  <Col
                    style={prevNum < currNum ? { ...increase } : null}
                    xs={2}
                  >
                    {percentage}
                  </Col>
                  <Col xs={2}>{extractWeight(weight)}</Col>
                </Row>

                {name === activeEx?.name ? (
                  <Row>
                    <Col className="activeNotesRow">{notes || "No Notes"}</Col>
                    <Col className="legacy" xs={2}>
                      {String(
                        activeEx?.legacy
                          .map((v) => {
                            return v.split("/")[0];
                          })
                          .filter((v) => v)
                          .reverse()
                      )}
                    </Col>
                  </Row>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {parentRef.current?.clientHeight < childRef.current?.clientHeight &&
      scrolled ? (
        <div className="downArrow"></div>
      ) : null}
    </div>
  );
}

export default ActiveTable;
