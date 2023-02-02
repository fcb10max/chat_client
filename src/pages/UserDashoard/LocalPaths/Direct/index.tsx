import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { IUser, SocketType } from "../../../../interfaces";
import { IRenderMessage } from "../../../../interfaces/message";
import styles from "./styles.module.scss";

interface IDirect {
  socket: SocketType | null;
  user: IUser | null;
}

interface ILocationState {
  selectedUser: IUser;
}

export const Direct: React.FC<IDirect> = ({ socket, user }) => {
  const { selectedUser } = useLocation().state as ILocationState;
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IRenderMessage[]>([
    { content: "", from: -1, created: 0 },
  ]);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("message:getAll", {
      from: user.userID,
      to: selectedUser.userID,
    });
    socket.on("message:direct", (data) => {
      setMessages((prev) => [
        ...prev,
        { from: data.from, content: data.msg, created: Date.now() }, // TODO: invalid date
      ]);
    });
    socket.on("message:getAll", (messages) => {
      setMessages(
        messages.map(({ content, created, from }) => ({
          content: content,
          created: created,
          from: from,
        }))
      );
    });
  }, [socket, user, selectedUser]);

  const messageSendHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!socket || !user) return;

    socket.emit("message:direct", {
      msg: message,
      to: selectedUser.userID,
      from: user.userID,
    });
    setMessages((prev) => [
      ...prev,
      { from: user.userID, content: message, created: Date.now() },
    ]);
  };

  useEffect(() => {
    if (!messagesRef.current) return;

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className={styles.direct}>
      <div className={styles.messages} ref={messagesRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.from === user?.userID ? styles.self : styles.notSelf}
          >
            <div>TODO</div>
            <div>
              <h4>
                {msg.from === user?.userID
                  ? user.username
                  : selectedUser.username}
              </h4>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.textInput}>
        <input
          onChange={(e) => setMessage(e.currentTarget.value)}
          type="text"
          name="message"
          placeholder="Type message"
          value={message}
        />
        <button onClick={messageSendHandler} disabled={!!!socket}>
          {!!socket ? "Send" : "Loading..."}
        </button>
      </div>
    </div>
  );
};
