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
  const [messages, setMessages] = useState<IMessageFromDB[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement[]>([]);
  const [messagesInView, setMessagesInView] = useState<string[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

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
    socket.on("message:statusUpdate", (msg_ids) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg_ids.includes(msg.message_id) && msg.from === user.id
            ? { ...msg, isRead: true }
            : msg
        )
      );
    });

    return () => {
      socket.off("message:direct");
      socket.off("message:statusUpdate");
    };
  }, [socket, user, selectedUser]);

  useEffect(() => {
    if (!messagesRef.current || !observerRef.current.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            !messagesInView.includes(entry.target.id)
              ? setMessagesInView((prev) => [...prev, entry.target.id])
              : setMessagesInView((prev) =>
                  prev.filter((i) => i !== entry.target.id)
                );
          }
        }
      },
      {
        root: messagesRef.current,
        threshold: 0.9,
      }
    );
    observerRef.current.forEach((div) => observer.observe(div));
    return () => {
      observerRef.current.forEach((div) => observer.unobserve(div));
    };
  }, [messages]);

  useEffect(() => {
    if (!messagesRef.current || !messages.length) return;
    if (isFirstRender) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
      setIsFirstRender(false);
      return;
    }
    const lastMsgFrom = messages.sort((a, b) => a.created - b.created)[
      messages.length - 1
    ].from;
    if (lastMsgFrom === selectedUser.id) return;
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const seenMessagesIds = messagesInView.map((msg) =>
      parseInt(msg.split("-")[1])
    );
    socket.emit("message:updateStatus", seenMessagesIds, (success, err) => {
      if (!success) return setError(err);
      setMessages((prev) =>
        prev.map((i) => {
          if (seenMessagesIds.includes(i.message_id))
            return { ...i, isRead: true };
          return i;
        })
      );
    });
  }, [messagesInView]);

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
        setMessages((prev) => [...prev, msg]);
      }
    );
    setMessage("");
  };

  return (
    <div className={styles.direct}>
      <div className={styles.messages} ref={messagesRef}>
        {messages.length > 0 &&
          messages
            .sort((a, b) => a.created - b.created)
            .map((msg) => (
              <div
                key={msg.message_id}
                className={msg.from === user?.id ? styles.self : styles.notSelf}
                id={"message" + "-" + msg.message_id}
                ref={(el) => {
                  if (!el || msg.from !== selectedUser.id) return;
                  msg.isRead || observerRef.current.indexOf(el) !== -1
                    ? (observerRef.current = observerRef.current.filter(
                        (i) => i !== el
                      ))
                    : observerRef.current.push(el);
                }}
              >
                <div>TODO</div>
                <div>
                  <h4>
                    {msg.from === user?.id
                      ? user.username
                      : selectedUser.username}
                  </h4>
                  <p>{msg.content}</p>
                  {msg.from === user?.id && (
                    <h5>{msg.isRead ? "Seen" : "Not seen"}</h5>
                  )}
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
