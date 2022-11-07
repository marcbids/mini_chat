import React, { useContext, useState } from "react";
import { Form, Button, Container, FloatingLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../userContext";
import { toJSON, API_URL } from "../../app-helper";
import axios from "axios";

import Swal from "sweetalert2";

import "./index.css";

export const Signin = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
    setInvalid(false);
  };

  const authenticate = () => {
    const options = {
      email: data.email,
      password: data.password,
    };
    axios.post(API_URL + "/users/login", options).then((data) => {
      data = data.data;
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        getUserDetails(data.accessToken);
      }
      if (!data) {
        setInvalid(true);
      }
    });
  };

  const getUserDetails = (accessToken) => {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    axios.get(`${API_URL}/users/details`, config).then((data) => {
      data = data.data;
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });
      Swal.fire({
        icon: "success",
        title: "Awesome",
        text: "Logged in successfully!",
      }).then((data) => {
        if (data.isDismissed || data.isConfirmed) {
          navigate("../../Chat", { replace: true });
          navigate(0);
        }
      });
    });
  };

  const handleSubmit = (e) => {
    if (!data.email || !data.password) return;
    e.preventDefault();
    authenticate();
  };
  return (
    <>
      <Container id="login-container">
        <div id="login">
          <Form id="login-form">
            <Form.Group id="login-title" className="mb-3" controlId="title">
              <h2>SIGN IN</h2>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <FloatingLabel
                label="Email address"
                className="mb-3 input-placeholder-label"
              >
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={(e) => handleChange(e)}
                  className={invalid.toString() === "true" ? "error" : ""}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <FloatingLabel
                label="Password"
                className="mb-3 input-placeholder-label"
              >
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => handleChange(e)}
                  className={invalid.toString() === "true" ? "error" : ""}
                />
              </FloatingLabel>
            </Form.Group>
            <label
              id="invalid-userpass"
              className={invalid.toString() === "true" ? "" : "hidden"}
            >
              Invalid username/password
            </label>
            <Form.Group className="mb-3" controlId="rememberme">
              <Form.Check type="checkbox" label="Remember password" />
            </Form.Group>
            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                className="block mb-3"
                onClick={(e) => handleSubmit(e)}
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
        <p className="mt-2">
          Don't have an account yet? <a href="/signup">Sign Up</a>
        </p>
      </Container>
    </>
  );
};
