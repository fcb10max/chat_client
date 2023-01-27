import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import SearchUser from "../../components/SearchUser";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../interfaces/socket";

interface IUser {
  id: number;
}

const UserDashboard = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/checkToken", {
      credentials: "include",
    })
      .then((d) => d.json())
      .then((d) => {
        if (!d.success) {
          if (d.errMsg === "Token not found") {
            return navigate("/login");
          }
          setIsError(true);
          setErrorMessage(d.errMsg);
          return;
        }
        setUser(d.user);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!user) return;
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      process.env.REACT_APP_WS_SERVER_URL ?? "ws://localhost:3000/"
    );
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <div>
      {isError && <p>{errorMessage}</p>}
      <SearchUser />
    </div>
  );
};

export default UserDashboard;
