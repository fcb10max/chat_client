import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInValues } from "../../interfaces/user";
import styles from "./styles.module.scss";

const Login: React.FC = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState<SignInValues>({
    password: "",
    username: "",
  });

  useEffect(() => {
    checkInputs();
  }, [data]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    const { name, value } = e.currentTarget;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (errorMessage) return setIsError(true);
    const { username, password } = data;
    setIsLoading(true);
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: "include",
    })
      .then((d) => d.json())
      .then((d) => {
        setIsLoading(false);
        if (!d.success) {
          setIsError(true);
          setErrorMessage(d.msg);
          return;
        } else {
          // TODO: show user that login process passed succesfully
          console.log(d);
          navigate("/");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage("Something went wrong... Try again");
        console.log(err.message);
      });
  };

  const checkInputs = () => {
    const { username, password } = data;
    if (!username || !password) {
      setErrorMessage("Please fill all inputs");
    } else {
      setErrorMessage("");
    }
  };

  return (
    <div className={styles.login}>
      {isError && <p>{errorMessage}</p>}
      <form>
        <label htmlFor="username">
          Username:
          <input
            onChange={inputChangeHandler}
            name="username"
            type="text"
            value={data.username}
          />
        </label>
        <label htmlFor="username">
          Password:
          <input
            onChange={inputChangeHandler}
            name="password"
            type="password"
            value={data.password}
          />
        </label>
        <button onClick={handleSubmit} disabled={isLoading || isError}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Login;
