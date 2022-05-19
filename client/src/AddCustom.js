import React, { useEffect, useState } from "react";
import "./addCustom.scss";
import { useSpring, animated } from "react-spring";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AddCustom({ active, cActive, collapse, cCollapse, schedule }) {
  const [formData, cFormData] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  });
  // const [suggestions, cSuggestions] = useState(["one", "two", "three", "four"]);
  const [suggestions, cSuggestions] = useState([]);
  const [master, cMaster] = useState([]);
  const arrow = {
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: collapse ? "5px solid #fff" : "none",
    borderBottom: collapse ? "none" : "5px solid #fff",
  };
  const slider = useSpring({
    // opacity: collapse ? 1 : 0,
    transform: !collapse ? "translate(100vw)" : "translate(0vw)",
    zIndex: !collapse ? "-200" : "200",
  });
  const changeHandler = (e) => {
    let { name, value } = e.target;
    cFormData((p) => ({ ...p, [name]: value }));
    if (name === "name") {
      if (master.length === 0) {
        loadFilter();
      }
      updateFilter(value);
    }
  };
  useEffect(() => {
    if (schedule) {
      loadFilter();
    }
  }, [schedule]);

  const loadFilter = () => {
    if (!schedule) {
      return;
    }
    cMaster(
      schedule
        ?.reduce((p, c) => {
          return { exercises: [...p.exercises, ...c.exercises] };
        })
        ["exercises"].map((v) => v.name)
        .filter((v, i, a) => {
          return a.lastIndexOf(v) === i;
        })
        .sort()
    );
  };

  const updateFilter = (name) => {
    cSuggestions(
      master.filter((v) => {
        return v.toLowerCase().includes(name.toLowerCase());
      })
    );
  };
  return (
    <div className="addCustomContainer">
      <div
        className="toggleHandleContainer"
        onClick={() => cCollapse((p) => !p)}
      >
        <div className="toggleHandle">
          <div style={{ ...arrow }} className="toggleArrow" />
        </div>
      </div>
      <animated.div className="overlayContainer" style={slider}>
        Add custom exercise
        <Form>
          <Row>
            <Col className="addCustomCol">
              <Form.Control
                value={formData.name}
                onChange={(e) => changeHandler(e)}
                name="name"
                className="addCustomForm"
                variant="dark"
                bg="dark"
                placeholder="Name"
              ></Form.Control>
              <ul
                className="suggestions"
                style={{ border: !formData ? "none" : "inherit" }}
              >
                {formData.name
                  ? suggestions.map((v, i) => (
                      <li
                        onClick={() => {
                          cFormData((p) => ({ ...p, name: v }));
                          cSuggestions([]);
                        }}
                        key={i}
                        className="suggestionsLis"
                      >
                        {v}
                      </li>
                    ))
                  : null}
              </ul>
              <Row className="addCustomRow">
                <Col className="addCustomCol">
                  <Form.Control
                    value={formData.sr}
                    onChange={(e) => changeHandler(e)}
                    name="sets"
                    className="addCustomForm addSets"
                    variant="dark"
                    bg="dark"
                    placeholder="Sets"
                  ></Form.Control>
                </Col>
                <Col className="addCustomCol">
                  <Form.Control
                    value={formData.sr}
                    onChange={(e) => changeHandler(e)}
                    name="reps"
                    className="addCustomForm addSets"
                    variant="dark"
                    bg="dark"
                    placeholder="Reps"
                  ></Form.Control>
                </Col>
              </Row>
              <Form.Control
                value={formData.weight}
                onChange={(e) => changeHandler(e)}
                name="weight"
                className="addCustomForm"
                variant="dark"
                bg="dark"
                placeholder="Weight"
              ></Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={() => {
                  cCollapse((p) => !p);
                  cActive((p) => ({
                    ...p,
                    exercises: [
                      ...p.exercises,
                      {
                        name: formData.name,
                        notes: "",
                        percentage: "Custom",
                        reps: formData.reps,
                        sets: formData.sets,
                        warmup: "",
                        weight: formData.weight,
                      },
                    ],
                  }));
                  cFormData({
                    name: "",
                    sets: "",
                    reps: "",
                    weight: "",
                  });
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </animated.div>
    </div>
  );
}

export default AddCustom;
