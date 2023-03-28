import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function InputComponent({
  activeEx,
  client,
  active,
  cActive,
  cActiveEx,
  user,
}) {
  const [text, cText] = useState({ kg: "", lb: "", notes: "" });

  useEffect(() => {
    if (!activeEx.weight) {
      cText((p) => ({ ...p, kg: "", lb: "" }));
    } else if (!activeEx.weight.includes("/")) {
      cText((p) => ({
        ...p,
        kg: activeEx.weight,
        lb: (activeEx.weight * 2.205).toFixed(3),
      }));
    } else {
      cText((p) => ({
        ...p,
        kg: activeEx.weight.split("/")[0],
        lb: activeEx.weight.split("/")[1],
      }));
    }
  }, [activeEx]);

  const submitHandler = async () => {
    let { kg, lb, notes } = text;
    if (kg && lb && notes) {
      let updated = await client.submitExercise(activeEx, text, active);
      cActiveEx({});
      cActive(updated);
    } else {
      alert("Fill out all the fields");
    }
  };
  const resetHandler = async () => {
    cText({ kg: "", lb: "", notes: "" });
    let ret = await client.submitExercise(
      activeEx,
      { kg: "", lb: "", notes: "" },
      active
    );
    cActive(ret);
    cActiveEx({});
  };
  return (
    <div className="inputContainer">
      <Form>
        <Form.Group className="mb-3">
          <Row>
            <Col>
              <Form.Control
                disabled={!user}
                style={!user ? { cursor: "not-allowed" } : null}
                variant="dark"
                className="bg-dark text-white "
                name="kgInput"
                size="sm"
                type="text"
                value={text.kg}
                placeholder={"KGs"}
                onClick={() =>
                  cText((p) => {
                    return { ...p, lb: "", kg: "" };
                  })
                }
                onChange={(e) => {
                  cText((c) => {
                    if (!isNaN(e.target.value)) {
                      return {
                        ...c,
                        kg: e.target.value,
                        lb: (e.target.value * 2.205).toFixed(3),
                      };
                    } else {
                      return c;
                    }
                  });
                }}
              />
            </Col>
            <Col>
              <Form.Control
                disabled={!user}
                style={!user ? { cursor: "not-allowed" } : null}
                className="bg-dark text-white "
                name="lbInput"
                size="sm"
                type="text"
                value={text.lb}
                placeholder={text.kg ? (text.kg * 2.205).toFixed(3) : "LBs"}
                onClick={() =>
                  cText((p) => {
                    return { ...p, lb: "", kg: "" };
                  })
                }
                onChange={(e) => {
                  cText((c) => {
                    if (!isNaN(e.target.value)) {
                      return {
                        ...c,
                        lb: e.target.value,
                        kg: (e.target.value / 2.205).toFixed(3),
                      };
                    } else {
                      return c;
                    }
                  });
                }}
              />
            </Col>
          </Row>

          <Form.Control
            disabled={!user}
            style={!user ? { cursor: "not-allowed" } : null}
            className="bg-dark text-white "
            name="lbInput"
            size="sm"
            as="textarea"
            value={text.notes}
            onChange={(e) => {
              cText((c) => {
                return { ...c, notes: e.target.value };
              });
            }}
            placeholder="Notes"
            rows={2}
          />
        </Form.Group>
      </Form>
      <Button
        disabled={!user}
        style={!user ? { cursor: "not-allowed" } : null}
        variant="dark"
        onClick={() => {
          submitHandler();
        }}
        className="inputButtons"
      >
        Submit
      </Button>
      <Button
        disabled={!user}
        style={!user ? { cursor: "not-allowed" } : null}
        variant="dark"
        onClick={() => {
          resetHandler();
        }}
        className="inputButtons"
      >
        Reset Exercise
      </Button>
    </div>
  );
}

export default InputComponent;
