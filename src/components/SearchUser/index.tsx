import React, { useEffect, useState } from "react";

interface ISuggUser {
  username: string;
  id: number;
}

const SearchUser = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<ISuggUser[]>([]);
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/userSearchSuggestions")
      .then((j) => j.json())
      .then((d) => {
        if (!d.success) {
          setIsError(true);
          setErrMsg("Something went wron during users suggestion fetch");
          return;
        }
        setSearchSuggestions(d.users);
      });
  }, []);

  const suggestionItemClickHandler = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const value = e.currentTarget.innerText;
    setSearchValue(value);
  };

  return (
    <div>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
      />
      <div>
        <h1>Suggestions:</h1>
        <ul>
          {searchSuggestions.map((i) => (
            <li onClick={suggestionItemClickHandler} key={i.id}>
              {i.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchUser;
