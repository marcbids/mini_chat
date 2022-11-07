import React, { useEffect, useState } from "react";
import axios from "axios";
import AppHelper from "../../app-helper";
import "./index.css";

export const Conversation = ({ data, currentUser }) => {
  const [chatuser, setChatuser] = useState(null);
  // console.log(chatuser);

  const handleClick = (e) => {
    e.preventDefault();
    console.log(data._id);
    axios
      .all([
        axios.delete(`${AppHelper.API_URL}/chat/delete/${data._id}`),
        axios.delete(`${AppHelper.API_URL}/conversation/delete/${data._id}`),
      ])
      .then(
        axios.spread((chat, convo) => {
          console.log(chat);
          console.log(convo);
        })
      );
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
