import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IConversation } from "../../../../interfaces";
import styles from "./styles.module.scss";

interface IUserContacts {
  convs: IConversation[];
  activeUsers: number[];
}

interface IConvUser extends IConversation {
  isActive: boolean;
}

export const UserContacts: React.FC<IUserContacts> = ({
  convs,
  activeUsers,
}) => {
  const [users, setUsers] = useState<IConvUser[]>([]);

  useEffect(() => {
    setUsers(
      convs.map((i) => ({
        isActive: activeUsers.indexOf(i.user.id) !== -1 ? true : false,
        lastMsg: i.lastMsg,
        user: i.user,
      }))
    );
  }, [convs, activeUsers]);

  return users.length > 0 ? (
    <div className={styles.userContacts}>
      {users.map((conv) => (
        <Link
          to={"/user/dashboard/direct"}
          state={{
            selectedUser: {
              id: conv.user.id,
              username: conv.user.username,
            },
          }}
          key={conv.user.id}
        >
          <div>
            <div></div>
          </div>
          <div>
            <h3>
              <span className={conv.isActive ? styles.active : ""}></span>{" "}
              {conv.user.username}
            </h3>
            <p>{conv.lastMsg.content}</p>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <p>Loading...</p>
  );
};
