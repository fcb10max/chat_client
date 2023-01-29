import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import "./globalStyles.module.scss";
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


const App = () => {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <main>
        <Wrapper>
          <Routes>
            <Route path="/" element={<Navigate to={`/user/dashboard`} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user/dashboard/*" element={<UserDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Wrapper>
      </main>
    </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
