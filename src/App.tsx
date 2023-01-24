import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "./globalStyles.module.scss";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./interfaces/socket";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashoard";

interface IWrapperProps {
  children: React.ReactElement;
}

const Wrapper: React.FC<IWrapperProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return children;
};

interface IUser {
  id: number;
}

const App = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      process.env.REACT_APP_WS_SERVER_URL ?? "ws://localhost:3000/"
    );
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <main>
        <Wrapper>
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to={user && user.id ? `/user/${user?.id}/dashboard` : "/auth"}
                />
              }
            />
            <Route path="/auth" element={<Auth socket={socket} />} />
            <Route path="/user/:id/dashboard" element={<UserDashboard />} />
          </Routes>
        </Wrapper>
      </main>
    </BrowserRouter>
  );
};

export default App;
