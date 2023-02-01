import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ActiveUsers, SearchUser } from "../../components";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  IUser,
  SocketType,
} from "../../interfaces";
import { IConversation } from "../../interfaces/message";
import Direct from "./LocalPaths/Direct";
import UserContacts from "./LocalPaths/UserContacts";

const UserDashboard = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const navigate = useNavigate();
  const { isLoading } = useQuery({
    queryKey: ["checkToken"],
    queryFn: () => {
      return fetch("http://localhost:3000/api/auth/checkToken", {
        credentials: "include",
      }).then(async (d) => {
        const res = await d.clone().json();
        if (d.ok && res.success) return d.json();
        throw new Error(res.msg);
      });
    },
    onError: (err: Error) => {
      if (err.message === "Token not found") {
        return navigate("/login");
      }
      setIsError(true);
      setErrorMessage(err.message);
    },
    onSuccess: (res) => {
      setUser(res.user);
    },
  });

  useEffect(() => {
    if (!user) return;
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      process.env.REACT_APP_WS_SERVER_URL ?? "ws://localhost:3000/",
      { auth: user }
    );

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message:direct", (data) => {
      console.log("message: ", data);
    });
    socket.emit("message:getAllConvs");
    socket.on("message:getAllConvs", (conversations: IConversation[]) =>
      setConversations(conversations)
    );
  }, [socket]);

  return (
    <div>
      {isError && <p>{errorMessage}</p>}
      <SearchUser />
      <ActiveUsers socket={socket} />
      <Routes>
        <Route path="/" element={<UserContacts convs={conversations} />} />
        <Route
          path="/direct"
          element={<Direct socket={socket} user={user} />}
        />
      </Routes>
    </div>
  );
};

export default UserDashboard;
