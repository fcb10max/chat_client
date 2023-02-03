import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IUser, SocketType } from "../../../../interfaces";
import styles from "./styles.module.scss";

interface ISidebar {
  socket: SocketType;
}

const Sidebar: React.FC<ISidebar> = ({ socket }) => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState<
    Pick<IUser, "id" | "username">[]
  >([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("users:getSuggestions", { username: search }, (suggs, err) => {
      if (err) return setErrorMessage(err);
      setSuggestions(suggs);
    });
  }, [socket, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <aside className={styles.sidebar}>
      <section>
        <input
          value={search}
          onChange={handleSearch}
          type="text"
          placeholder="Search user"
        />
        {search && suggestions.length > 0 && (
          <div>
            {suggestions.map((item) => (
              <Link
                to={"/user/dashboard/direct"}
                state={{ selectedUser: item }}
                key={item.id}
                onClick={() => setSearch("")}
              >
                {item.username}
              </Link>
            ))}
          </div>
        )}
      </section>
      <section>All chats</section>
      <section>Private chats</section>
      <section>Groups</section>
      <section>Profile</section>
      <section>Settings</section>
    </aside>
  );
};

export default Sidebar;
