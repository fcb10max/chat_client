import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

interface ISuggestion {
  username: string;
  userID: number;
}

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const { mutate } = useMutation({
    mutationKey: ["userSearchSuggestion"],
    mutationFn: (searchValue: string) => {
      return fetch("http://localhost:3000/api/userSearchSuggestions", {
        method: "POST",
        body: JSON.stringify({ username: searchValue }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (d) => {
        const res = await d.clone().json();
        if (d.ok && res.success) return d.json();
        throw new Error(res.msg);
      });
    },
    onError: (err: Error) => {
      setErrorMessage("Something went wrong during users suggestion fetch");
      console.log(err.message);
    },
    onSuccess: (res) => {
      setSuggestions(res.users);
    },
  });


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    mutate(search);
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
                key={item.userID}
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
