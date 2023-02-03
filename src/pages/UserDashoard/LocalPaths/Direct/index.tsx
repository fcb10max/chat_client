import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { IUser, SocketType, IMessageFromDB } from "../../../../interfaces";
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IMessageFromDB[]>([
    { content: "", from: -1, created: -1, message_id: -1, to: -1 },
  ]);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);


  useEffect(() => {
    if (!socket || !user) return;
    socket.emit(
      "message:getAll",
      {
        from: user.id,
        to: selectedUser.id,
      },
      (res, err) => {
        if (err) return setError(err);
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
        to: selectedUser.id,
        from: user.id,
      },
      (msg, err) => {
        if (err) return setError(err);
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

  return (
    <div className={styles.direct}>
      <div className={styles.messages} ref={messagesRef}>
        {messages
          .sort((a, b) => a.created - b.created)
          .map((msg, idx) => (
            <div
              key={idx}
              className={msg.from === user?.id ? styles.self : styles.notSelf}
            >
              <div>TODO</div>
              <div>
                <h4>
                  {msg.from === user?.id
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
