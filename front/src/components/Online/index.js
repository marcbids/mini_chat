import React, { useEffect, useState } from "react";
import AppHelper from "../../app-helper";
import "./index.css";
import axios from "axios";

export const Online = ({
  onlineUsers,
  currentId,
  setCurrentChat,
  setCurrentReceiver,
}) => {
  const [users, setUsers] = useState([]);
  const [online, setOnline] = useState([]);

  useEffect(() => {
    getUsers();
  }, [currentId]);

  const getUsers = () => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      fetch(`${AppHelper.API_URL}/users/all/`, options)
        .then(AppHelper.toJSON)
        .then((data) => {
          setUsers(data);
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (onlineUsers !== null && users !== null) {
      setOnline(
        users.filter((e) => onlineUsers.some((f) => f.userId === e._id))
      );
    }
  }, [users, onlineUsers]);
  const handleClick = (e) => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      axios
        .get(`${AppHelper.API_URL}/conversation/find/${currentId}/${e._id}`)
        .then((data) => {
          setCurrentReceiver(e._id);
          setCurrentChat(data.data);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chatOnline">
      <div className="onlineUsers">
        {online.map((e, index) =>
          e._id !== currentId ? (
            <div
              className="onlineName"
              onClick={() => handleClick(e)}
              key={index}
            >
              {e.name}
              <span className="onlineBadge"> online</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
