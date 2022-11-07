import React, { useEffect, useState } from "react";
import { NavBar, Footer } from "./components";
import { Chat, Signin, Signup, Logout } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./userContext";
import AppHelper from "./app-helper";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [user, setUser] = useState({
    //user state is an object with properties from our local storage
    id: null,
    name: null,
    email: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.clear();

    setUser({ id: null, name: null, email: null, isAdmin: null });
  };

  useEffect(() => {
    const options = {
      headers: {
        Authorization: `Bearer ${AppHelper.getAccessToken()} `,
        "Content-Type": "application/json",
      },
    };

    try {
      fetch(`${AppHelper.API_URL}/users/details`, options)
        .then(AppHelper.toJSON)
        .then((data) => {
          if (typeof data._id !== undefined) {
            setUser({
              id: data._id,
              name: data.name,
              email: data.email,
              isAdmin: data.isAdmin,
            });
          } else {
            setUser({ id: null, name: null, email: null, isAdmin: null });
          }
        });
    } catch (e) {}
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser, unsetUser }}>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
        <Footer />
      </UserContext.Provider>
    </>
  );
};

export default App;
