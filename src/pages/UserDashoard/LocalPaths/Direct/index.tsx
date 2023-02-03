import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { IUser, SocketType } from "../../../../interfaces";
import { IMessageFromDB } from "../../../../interfaces/message";
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
  const [messages, setMessages] = useState<IMessageFromDB[]>([
    { content: "", from: -1, created: -1, message_id: -1, to: -1 },
  ]);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit(
      "message:getAll",
      {
        from: user.userID,
        to: selectedUser.userID,
      },
      (res) => {
        setMessages(res);
      }
    );
    socket.on("message:direct", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("message:direct");
    };
  }, [socket, user, selectedUser]);

  const messageSendHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!socket || !user) return;

    socket.emit(
      "message:direct",
      {
        msg: message,
        to: selectedUser.userID,
        from: user.userID,
      },
      (msg) => {
        setMessages((prev) => [
          ...prev,
          {
            content: msg.content,
            from: msg.from,
            created: msg.created,
            message_id: msg.message_id,
            to: msg.to,
          },
        ]);
      }
    );

    setMessage("");
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
        {messages
          .sort((a, b) => a.created - b.created)
          .map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.from === user?.userID ? styles.self : styles.notSelf
              }
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
