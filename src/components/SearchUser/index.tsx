import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ISuggUser {
  username: string;
  id: number;
}

export const SearchUser = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<ISuggUser[]>([]);
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { mutate } = useMutation({
    mutationKey: ["userSearchSuggestion", searchValue],
    mutationFn: (searchValue) => {
      return fetch("http://localhost:3000/api/userSearchSuggestions", {
        method: "POST",
        body: JSON.stringify({ username: searchValue }),
      }).then(async (d) => {
        const res = await d.clone().json();
        if (d.ok && res.success) return d.json();
        throw new Error(res.msg);
      });
    },
    onError: (err: Error) => {
      setIsError(true);
      setErrMsg("Something went wrong during users suggestion fetch");
      console.log(err.message);
    },
    onSuccess: (res) => {
      setSearchSuggestions(res.users);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  const suggestionItemClickHandler = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const value = e.currentTarget.innerText;
    setSearchValue(value);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  return (
    <div>
      <input type="text" value={searchValue} onChange={inputChangeHandler} />
      <div>
        {isError && <p>{errMsg}</p>}
        {searchSuggestions.length > 0 && (
          <>
            <h1>Suggestions:</h1>
            <ul>
              {searchSuggestions.map((i) => (
                <li onClick={suggestionItemClickHandler} key={i.id}>
                  <Link
                    to={"/user/dashboard/direct"}
                    state={{ selectedUser: i }}
                  >
                    {i.username}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};