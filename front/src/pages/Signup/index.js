import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  FloatingLabel,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import AppHelper from "../../app-helper";
import "./index.css";

export const Signup = () => {
  const email = useRef(null);
  const [match, setMatch] = useState("");
  const [emailExist, setEmailexist] = useState(false);
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    confirm_password: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };
  const handleClick = (e) => {
    if (
      !data.first_name ||
      !data.last_name ||
      !data.email ||
      !data.password ||
      !data.confirm_password
    )
      return;

    e.preventDefault();
    if (!match) {
      console.log("password did not match");
      return;
    }
    signup();
  };

  const signup = () => {
    const options = {
      name: data.first_name + " " + data.last_name,
      email: data.email,
      password: data.password,
    };
    axios.post(`${AppHelper.API_URL}/users/signup`, options).then((data) => {
      data = data.data;
      if (data.error) {
        setEmailexist(true);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error,
        }).then((data) => {
          if (data.isDismissed || data.isConfirmed) {
            email.current.focus();
          }
        });
      } else {
        setEmailexist(false);
        Swal.fire({
          icon: "success",
          title: "Awesome",
          text: "Account has been created!",
        }).then((data) => {
          if (data.isDismissed || data.isConfirmed) {
            navigate("../signin", { replace: true });
            navigate(0);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (!data.password && !data.confirm_password) return;
    data.password !== data.confirm_password
      ? setMatch("false")
      : setMatch("true");
  }, [data.confirm_password]);
  return (
    <>
      <Container id="register-container">
        <div id="register">
          <Form id="register-form">
            <Form.Group id="register-title" className="mb-3" controlId="title">
              <h2>Register</h2>
              <p>Create your account. It's free and only takes a minute.</p>
            </Form.Group>
            <div className="register-nameGroup">
              <Form.Group className="mb-3" controlId="name">
                <Row className="g-2">
                  <Col>
                    <FloatingLabel
                      label="First name"
                      className="register-input-placeholder-label flex-fill"
                    >
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        name="first_name"
                        value={data.first_name}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      label="Last name"
                      className="register-input-placeholder-label flex-fill"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        name="last_name"
                        value={data.last_name}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Form.Group>
            </div>
            <Form.Group className="mb-3" controlId="email">
              <FloatingLabel
                label="Email address"
                className="mb-3 register-input-placeholder-label"
              >
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={data.email}
                  onChange={(e) => handleChange(e)}
                  required
                  ref={email}
                  className={emailExist.toString() === "false" ? "" : "error"}
                />
              </FloatingLabel>
            </Form.Group>
            <span
              id="mismatch-pass"
              className={match === "false" ? "" : "hidden"}
            >
              Password mismatch
            </span>
            <Form.Group className="mb-3" controlId="password">
              <Row className="g-2">
                <Col>
                  <FloatingLabel
                    label="Password"
                    className="register-input-placeholder-label"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={data.password}
                      onChange={(e) => handleChange(e)}
                      required
                      className={match === "false" ? "error" : ""}
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel
                    label="Confirm password"
                    className="register-input-placeholder-label"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Confirm password"
                      name="confirm_password"
                      value={data.confirm_password}
                      onChange={(e) => handleChange(e)}
                      required
                      className={match === "false" ? "error" : ""}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Form.Group>
            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                className="block mb-3"
                onClick={(e) => handleClick(e)}
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
        <div id="account-created">
          <p className="mt-2">
            Already have an account? <a href="/signin">Log in</a>
          </p>
        </div>
      </Container>
    </>
  );
};
