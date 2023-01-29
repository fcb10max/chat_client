import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IUser, SocketType } from "../../interfaces";

interface IActiveUsers {
  socket: SocketType | null;
}

export const ActiveUsers: React.FC<IActiveUsers> = ({ socket }) => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("users", (users) => {
      setUsers(users);
    });
  }, [socket]);


  return (
    <div>
      <h1>active users:</h1>
      <ul>
        {users.map((i) => (
          <li key={i.userID}>
            <Link to={"/user/dashboard/direct"} state={{ selectedUser: i }}>
              {i.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
