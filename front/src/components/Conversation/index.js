import React, { useEffect, useState } from "react";
import axios from "axios";
import AppHelper from "../../app-helper";
import "./index.css";

export const Conversation = ({ data, currentUser, test }) => {
  const [chatuser, setChatuser] = useState(null);

  const handleClick = (e) => {
    e.preventDefault();
    deleteConvo(data._id);
    test(data);
  };

  const deleteConvo = (params) => {
    const fetch1 = () => {
      fetch(`${AppHelper.API_URL}/conversation/delete/${params}`, {
        method: "DELETE",
      }).then((res) => res.json());
    };
    const fetch2 = () => {
      fetch(`${AppHelper.API_URL}/chat/delete/${params}`, {
        method: "DELETE",
      }).then((res) => res.json());
    };
    Promise.all([fetch1(), fetch2()]).then((data) => data);
  };

  useEffect(() => {
    const friendId = data.members.find((m) => m !== currentUser.id);
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${AppHelper.API_URL}/users/other/${friendId}`, options)
      .then(AppHelper.toJSON)
      .then((data) => setChatuser(data))
      .catch((e) => e);
  }, [data.id]);

  return (
    <div className="conversation" key={data.id}>
      <div className="conversationName">
        {chatuser ? <span>{chatuser.name}</span> : ""}{" "}
        <button onClick={(e) => handleClick(e)}>delete</button>
      </div>
    </div>
  );
};
