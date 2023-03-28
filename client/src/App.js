import React, { useState, useEffect } from "react";
import { ApiClient } from "./apiClient";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ActiveTable from "./ActiveTable";
import HistoryTable from "./HistoryTable";
import InputComponent from "./InputComponent";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import AddCustom from "./AddCustom";

function App() {
  const [schedule, cSchedule] = useState();
  // current == current days workout
  const [current, cCurrent] = useState(0);
  // active == day active in hud
  const [active, cActive] = useState({});
  const [activeEx, cActiveEx] = useState();
  const [collapse, cCollapse] = useState(false);

  const client = new ApiClient();

  const successStyle = active?.complete
    ? {
        border: "1px solid green",
        backgroundImage: "radial-gradient(#00FF0025 3px, #2c3034 1px)",
        backgroundPosition: " 0 0",
        backgroundSize: "30px 30px",
      }
    : { backgroundColor: "#2c3034", border: "1px solid #fff" };

  const setCurrentDay = (data) => {
    for (let i = 0; i < data.length; i++) {
      let current = data[i];
      if (!current.complete || i === 49) {
        cCurrent(current);
        cActive(current);
        break;
      }
    }
  };

  const setActiveDay = (bool) => {
    // cActiveEx(null);
    if (!bool && active.day != 1) {
      cActive(
        schedule.filter((v) => Number(v.day) === Number(active.day) - 1)[0]
      );
    } else if (bool && active.day != schedule.slice(-1)[0].day) {
      cActive((p) => {
        let test = schedule.filter(
          (v) => Number(v.day) === Number(active.day) + 1
        )[0];
        return test;
      });
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch("https://ipapi.co/json/");
      const ip = await response.json();
      console.log(ip);

      let { data } = await client.getSchedule(ip);
      cSchedule(data);
      setCurrentDay(data);
    };
    fetchSchedule();
  }, []);

  // when active is updated/changed, reflect changes in schedule
  useEffect(() => {
    if (schedule) {
      cSchedule((p) => {
        let updated = [...p] || [];
        updated?.map((v, i) => {
          if (v.day === active?.day) updated[i] = active;
        });
        return updated;
      });
      client.updateDay(active);
    }
  }, [active]);

  const submitDayHandler = (bool) => {
    if (bool) {
      const empty = [...active.exercises].map((v) => {
        return { ...v, weight: "", notes: "" };
      });
      cActive((p) => ({ ...p, complete: false, exercises: empty }));
      return;
    }
    let indices = active.exercises
      .map((v, i) => (!v.weight ? i : null))
      .filter((v) => v !== null);
    if (indices.length === 0) {
      cCurrent({ ...active, complete: true });
      cActive((p) => ({ ...p, complete: true }));
    } else {
      let res = window.confirm(
        "Exercises marked as incomplete, do you wish to continue?"
      );
      if (!res) {
        return;
      }
      let patient = [...active.exercises];
      indices.map((v) => {
        let empty = active.exercises[v];
        patient[v] = {
          ...empty,
          weight: empty.weight ? empty.weight : "None",
          notes: empty.notes ? empty.notes : "No Notes",
        };
      });
      cActive((p) => ({ ...p, complete: true, exercises: patient }));
      // ?submit day handler in case some exercises are not finished
    }
  };
  return (
    <div className="App">
      <div className="appContainer">
        <AddCustom
          active={active}
          cActive={cActive}
          collapse={collapse}
          cCollapse={cCollapse}
          schedule={schedule}
        />
        <Row className="dayToggleContainer">
          <Col className="prevDayContainer">
            <Button
              variant="dark"
              onClick={() => {
                cActiveEx({});
                setActiveDay(false);
              }}
            >
              Prev Day
            </Button>
          </Col>
          <Col className="currentDayContainer">
            <Button
              variant="dark"
              onClick={() => {
                cActiveEx({});
                cActive(current);
              }}
            >
              Current
            </Button>
          </Col>
          <Col className="prevDayContainer">
            <Button
              variant="dark"
              onClick={() => {
                cActiveEx({});
                setActiveDay(true);
              }}
            >
              Next Day
            </Button>
          </Col>
        </Row>
        <div className="activeContentContainer">
          <ActiveTable
            data={active}
            activeEx={activeEx}
            cActiveEx={cActiveEx}
            schedule={schedule}
          />
        </div>
        {activeEx?.name ? (
          <div className="cutContainer">
            <HistoryTable
              active={active}
              schedule={schedule}
              activeEx={activeEx}
            />
            <InputComponent
              activeEx={activeEx}
              client={client}
              active={active}
              cActive={cActive}
              cActiveEx={cActiveEx}
            />
          </div>
        ) : null}
        <div className="bottomButtonContainer">
          <Row>
            <Col>
              <Button
                variant="dark"
                onClick={() => {
                  submitDayHandler(active?.complete ? true : false);
                }}
                style={{
                  border: `solid 1px ${active?.complete ? "red" : "green"}`,
                }}
              >
                {active?.complete ? "Reset Day" : "Complete Day"}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className="escapeContainer"
          style={{
            ...successStyle,
          }}
          onClick={() => {
            cActiveEx({});
          }}
        ></div>
      </div>
      {/* 

      
      */}
    </div>
  );
}

export default App;
