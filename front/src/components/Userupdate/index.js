import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, FloatingLabel } from "react-bootstrap";
import AppHelper from "../../app-helper";
import { UserContext } from "../../userContext";
import axios from "axios";
import "./index.css";

export const Userupdate = ({ show, setShow }) => {
  const { user, setUser } = useContext(UserContext);
  const [match, setMatch] = useState("false");
  const [value, setValue] = useState({
    name: "",
    confirm_password: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };
  const handleClose = () => setShow(false);
  const handleSubmit = (e) => {
    if (!value.name || !value.password || !value.confirm_password) return;

    e.preventDefault();
    if (!match) {
      console.log("password did not match");
      return;
    }
    update();
    handleClose();
    window.location.reload();
  };

  const update = () => {
    const options = {
      name: value.name,
      password: value.password,
    };
    const header = {
      headers: { Authorization: `Bearer ${AppHelper.getAccessToken()}` },
    };
    axios
      .post(`${AppHelper.API_URL}/users/update`, options, header)
      .then((data) => {
        let result = data.data;
        setUser((prev) => ({ ...prev, name: result.name }));
      });
  };

  useEffect(() => {
    if (!value.password && !value.confirm_password) return;
    value.password !== value.confirm_password
      ? setMatch("false")
      : setMatch("true");
  }, [value.confirm_password]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <div className="update-nameGroup">
          <Form.Group className="mb-3" controlId="name">
            <Row className="g-2">
              <Col>
                <FloatingLabel
                  label="Name"
                  className="update-input-placeholder-label flex-fill"
                >
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={value.name}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Row className="g-2">
              <Col>
                <FloatingLabel
                  label="Password"
                  className="update-input-placeholder-label"
                >
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={value.password}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  label="Confirm password"
                  className="update-input-placeholder-label"
                >
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="confirm_password"
                    value={value.confirm_password}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form.Group>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
