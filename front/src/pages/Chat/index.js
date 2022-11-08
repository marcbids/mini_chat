import React, { useContext, useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [allUsers, setAllUsers] = useState([]);
  const [deleteChat, setDeleteChat] = useState(false);
  const audio = new Audio(notif);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.sender,
        message: data.message,
        createdAt: Date.now(),
      });
    });
    socket.current.on("pong", (params) => {
      setDeleteChat(true);
    });
  }, []);

  useEffect(() => {
    if (typeof user.id !== "undefined" && user.id != null) {
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user.id]);

  const test = (params) => {
    let receiverId = params.members.find((member) => member !== user.id);
    setDeleteChat((e) => !e);
    socket.current.emit("ping", receiverId);
  };

  const send = (receiverId) => {
    socket.current.volatile.emit("sendMessage", {
      sender: user.id,
      receiver: receiverId,
      message: newMessage,
    });
    setNewMessage("");
  };

  useEffect(() => {
    getConversation();
    getUsers();
  }, [user.id, deleteChat, arrivalMessage, currentChat]);

  const notify = (params) => toast(params);

  const updateCurrentChat = () => {
    let user = allUsers.filter((e) => arrivalMessage.sender == e._id);

    let current = conversation.filter((e) => e.members.includes(user[0]._id));
    setCurrentChat(current[0]);
  };

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
          setAllUsers(data);
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (arrivalMessage != null && currentChat != "") {
      let user = allUsers.filter((e) => arrivalMessage.sender == e._id);
      audio.play();
      notify(`New message from ${user[0].name}`);
      arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

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
        });
    });
  };
  useEffect(() => {
    try {
      getChat();
    } catch (e) {
      // console.log("No chat history");
    }
  }, [currentChat, newMessage, deleteChat]);

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
                    <Conversation data={e} currentUser={user} test={test} />
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        onClick={updateCurrentChat}
      />
    </>
  );
};
