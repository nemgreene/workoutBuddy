import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function HistoryTable({ active, schedule = [], activeEx }) {
  const [history, cHistory] = useState([]);
  const [description, cDescription] = useState("");

  useEffect(() => {
    let updated = [...schedule]
      .filter((v) => {
        return Number(v.day) !== active.day && Number(v.day) < active.day;
      })
      .map((v) => {
        return {
          day: v.day,
          exercises: v.exercises.filter((f) => {
            return f.name === activeEx.name;
          })[0],
        };
      })
      .filter((v) => v.exercises)
      .reverse()
      .slice(-5);
    cHistory(updated);
    return () => {
      cDescription("");
    };
  }, [activeEx]);

  return (
    <div
      className="historyTableContainer"
      style={{ marginBottom: history.length > 0 ? "2vh" : 0 }}
    >
      {history.length > 0 ? (
        <Row>
          <Col>SetsxReps</Col>
          <Col>weight</Col>
          <Col>%</Col>
        </Row>
      ) : null}
      {history?.map((h, i) => {
        let { exercises, day } = h;
        return (
          <React.Fragment key={i}>
            <Row
              onClick={() => {
                if (
                  JSON.stringify({ day, ...exercises }) ===
                  JSON.stringify(description)
                ) {
                  cDescription({});
                } else {
                  cDescription({ day, ...exercises });
                }
              }}
            >
              <Col>{`${exercises.sets}x${exercises.reps}`}</Col>
              <Col>{exercises.weight || "-"}</Col>
              <Col>{exercises.percentage}</Col>
            </Row>
            {Number(description.day) === Number(day) ? (
              <Row className="desc">
                <Col>
                  {exercises?.notes !== "" ? exercises?.notes : "No notes"}
                </Col>
              </Row>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* </tbody> */}
    </div>
  );
}

export default HistoryTable;
