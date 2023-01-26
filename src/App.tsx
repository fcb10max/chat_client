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
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
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

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/auth/checkToken", {
  //     credentials: "include",
  //   })
  //     .then((d) => d.json())
  //     .then((d) => console.log(d));
  // }, []);

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
    <BrowserRouter>
      <main>
        <Wrapper>
          <Routes>
            <Route
              path="/"
              element={
                <NotFound />
                // <Navigate
                //   to={
                //     user && user.id ? `/user/dashboard` : "/login"
                //   }
                // />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Wrapper>
      </main>
    </BrowserRouter>
  );
};

export default App;
