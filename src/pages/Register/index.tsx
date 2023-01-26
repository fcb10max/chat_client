import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { SignUpValues } from "../../interfaces/user";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [data, setData] = useState<SignUpValues>({
    email: "",
    password: "",
    username: "",
    verify_password: "",
  });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkInputs();
  }, [data]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isError) setIsError(false);
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sumbitHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (errorMessage) return setIsError(true);
    const { username, password, email } = data;
    setIsLoading(true);
    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
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
          // TODO: show user that registration process passed succesfully

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
    const { username, password, verify_password, email } = data;
    if (!username || !password || !verify_password || !email) {
      setErrorMessage("Please fill all inputs");
    } else if (password !== verify_password) {
      setErrorMessage("Passwords does not match");
    } else {
      setErrorMessage("");
    }
  };

  return (
    <div className={styles.auth}>
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
        <label htmlFor="email">
          Email:
          <input
            onChange={inputChangeHandler}
            name="email"
            type="email"
            value={data.email}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            onChange={inputChangeHandler}
            name="password"
            type="password"
            value={data.password}
          />
        </label>
        <label htmlFor="verify_password">
          Verify Password
          <input
            onChange={inputChangeHandler}
            name="verify_password"
            type="password"
            value={data.verify_password}
          />
        </label>
        <button onClick={sumbitHandler} disabled={isLoading || isError}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Register;
