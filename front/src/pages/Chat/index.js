import React, { useContext, useState, useEffect, useRef } from "react";
import { Conversation, Chatbox, Online } from "../../components";
import { UserContext } from "../../userContext";
import AppHelper from "../../app-helper";
import "./index.css";
import io from "socket.io-client";
import axios from "axios";
import notif from "../../notif/notif.wav";

export const Chat = () => {
  const { user } = useContext(UserContext);
  const socket = useRef();
  const scrollRef = useRef();
  const [conversation, setConversation] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [currentReceiver, setCurrentReceiver] = useState("");
  const audio = new Audio(notif);

  useEffect(() => {
    getConversation();
  }, [user.id, messages]);

  useEffect(() => {
    if (arrivalMessage != null) {
      console.log("new message");
      audio.play();
    }
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.sender,
        message: data.message,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    if (typeof user.id !== "undefined") {
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user.id]);

  const getConversation = () => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(`${AppHelper.API_URL}/conversation/${user.id}`, options)
      .then(AppHelper.toJSON)
      .then((data) => {
        setConversation(data);
      })
      .catch((e) => e);
  };
  const newConversation = () => {
    const options = {
      senderId: user.id,
      receiverId: currentReceiver,
    };
    axios.post(`${AppHelper.API_URL}/conversation/`, options).then((data) => {
      let result = data.data;
      setCurrentChat(result);
      axios
        .post(`${AppHelper.API_URL}/chat`, {
          conversationId: result._id,
          sender: user.id,
          message: newMessage,
        })
        .then((data) => {
          setMessages([...messages, data.data]);
          getConversation();
        });
    });
  };
  useEffect(() => {
    try {
      getChat();
    } catch (e) {
      // console.log("No chat history");
    }
  }, [currentChat, newMessage]);

  const getChat = () => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${AppHelper.API_URL}/chat/${currentChat._id}`, options)
      .then(AppHelper.toJSON)
      .then((result) => {
        setMessages(result);
      })
      .catch((e) => e);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let receiverId;
    if (currentChat === "") {
      newConversation();
      send(currentReceiver);
    } else {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: user.id,
          conversationId: currentChat._id,
          message: newMessage,
        }),
      };
      fetch(`${AppHelper.API_URL}/chat/`, options)
        .then(AppHelper.toJSON)
        .then((result) => setMessages([...messages, result]))
        .catch((e) => e);
      send(
        (receiverId = currentChat.members.find((member) => member !== user.id))
      );
    }
  };

  const send = (receiverId) => {
    socket.current.emit("sendMessage", {
      sender: user.id,
      receiver: receiverId,
      message: newMessage,
    });
    setNewMessage("");
  };

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  return (
    <>
      <div id="chat-window">
        <div id="conversationsMenu">
          <div className="conversationContainer">
            <input
              type="text"
              placeholder="Search conversation..."
              className="conversationInput"
            />
            {conversation.length
              ? conversation.map((e, index) => (
                  <div onClick={() => setCurrentChat(e)} key={index}>
                    <Conversation data={e} currentUser={user} />
                  </div>
                ))
              : null}
          </div>
        </div>
        <div id="chatbox">
          <div className="chatboxContainer">
            {currentChat !== undefined ? (
              <>
                <div className="chatboxTop">
                  {messages.map((msg, index) => (
                    <div ref={scrollRef} key={index}>
                      <Chatbox message={msg} own={msg.sender === user.id} />
                    </div>
                  ))}
                </div>
                <div className="chatboxBot">
                  <textarea
                    className="chatboxinput"
                    placeholder="Write a message....."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                  <button className="chatboxSubmit" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="no-chat">Open a converstation to start</span>
            )}
          </div>
        </div>
        <div id="onlines">
          <div className="onlineContainer">
            <Online
              onlineUsers={onlineUsers}
              currentId={user.id}
              setCurrentChat={setCurrentChat}
              setCurrentReceiver={setCurrentReceiver}
            />
          </div>
        </div>
      </div>
    </>
  );
};
