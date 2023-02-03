import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocketType } from "../../../../interfaces";
import styles from "./styles.module.scss";

interface ISuggestion {
  username: string;
  id: number;
}

interface ISidebar {
  socket: SocketType;
}

const Sidebar: React.FC<ISidebar> = ({ socket }) => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("users:getSuggestions", { username: search }, (suggs) =>
      setSuggestions(suggs)
    );
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

// const { mutate } = useMutation({
//   mutationKey: ["userSearchSuggestion"],
//   mutationFn: (searchValue: string) => {
//     return fetch("http://localhost:3000/api/userSearchSuggestions", {
//       method: "POST",
//       body: JSON.stringify({ username: searchValue }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).then(async (d) => {
//       const res = await d.clone().json();
//       if (d.ok && res.success) return d.json();
//       throw new Error(res.msg);
//     });
//   },
//   onError: (err: Error) => {
//     setErrorMessage("Something went wrong during users suggestion fetch");
//     console.log(err.message);
//   },
//   onSuccess: (res) => {
//     setSuggestions(res.users);
//   },
// });

// const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setSearch(e.target.value);
//   mutate(search);
// };
