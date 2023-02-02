import React from "react";
import { Link } from "react-router-dom";
import { IConversation } from "../../../../interfaces/message";
import styles from "./styles.module.scss";

interface IUserContacts {
  convs: IConversation[];
}

export const UserContacts: React.FC<IUserContacts> = ({ convs }) => {
  return convs.length > 0 ? (
    <div className={styles.userContacts}>
      {convs.map((conv) => (
        <Link
          to={"/user/dashboard/direct"}
          state={{
            selectedUser: {
              userID: conv.user.id,
              username: conv.user.username,
            },
          }}
          key={conv.user.id}
        >
          <div>TODO: avatar</div>
          <div>
            <h3>{conv.user.username}</h3>
            <p>{conv.lastMsg.content}</p>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <p>Loading...</p>
  );
};
