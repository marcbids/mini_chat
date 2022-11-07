import React from "react";
import "./index.css";
import moment from "moment";
export const Chatbox = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBot">{moment(message.createdAt).fromNow()}</div>
    </div>
  );
};
