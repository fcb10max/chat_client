import React from "react";
import { IConversation } from "../../../../interfaces/message";

interface IUserContacts {
  convs: IConversation[];
}

const UserContacts: React.FC<IUserContacts> = ({ convs }) => {
  return convs.length > 0 ? (
    <div>
      {convs.map((conv) => (
        <div key={conv.user.id}>
          <h3>{conv.user.username}</h3>
          <p>{conv.lastMsg.content}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default UserContacts;
