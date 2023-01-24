import React, { ReactEventHandler, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { SignUpValues, User } from "../../interfaces/user";
import { SocketType } from "../../interfaces/socket";

interface IAuth {
  socket: SocketType | null;
}

const Auth: React.FC<IAuth> = ({ socket }) => {
  const [inputValues, setInputValues] = useState<SignUpValues>({
    username: "",
    password: "",
    verify_password: "",
    email: "",
  });
  const [showError, setShowError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("newUserAdded", () => {
      setIsLoading(false);
      setIsFormValid(true);
    });

    socket.on("authError", (msg) => {
      console.log("error: ", msg);

      setIsLoading(false);
      setIsFormValid(false);
      setErrorMessage(msg);
    });

    return () => {
      socket.off("authError");
      socket.off("newUserAdded");
    };
  }, []);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    checkInputs();
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!socket) return;
    if (isFormValid) {
      const user: User = {
        username: inputValues.username,
        password: inputValues.password,
        email: inputValues.email,
      };
      socket.emit("newUser", user);
      setIsLoading(true);
    } else {
      setShowError(true);
    }
  };

  const checkInputs = () => {
    const { username, password, verify_password, email } = inputValues;
    if (!username || !password || !verify_password || !email) {
      setIsFormValid(false);
      setErrorMessage("Please, fill all input fields!");
      return;
    }
    if (password !== verify_password) {
      setIsFormValid(false);
      setErrorMessage("Passwords does not match!");
      return;
    }
    setErrorMessage("");
    setIsFormValid(true);
  };

  return socket ? (
    <div className={styles.auth}>
      {showError && <p>{errorMessage}</p>}
      <form>
        <label htmlFor="username">
          Username:
          <input
            onChange={inputChangeHandler}
            name="username"
            type="text"
            value={inputValues.username}
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            onChange={inputChangeHandler}
            name="email"
            type="email"
            value={inputValues.email}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            onChange={inputChangeHandler}
            name="password"
            type="password"
            value={inputValues.password}
          />
        </label>
        <label htmlFor="verify_password">
          Verify Password
          <input
            onChange={inputChangeHandler}
            name="verify_password"
            type="password"
            value={inputValues.verify_password}
          />
        </label>
        <button onClick={handleSubmit} disabled={isLoading || showError}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  ) : (
    <p>Loading</p>
  );
};

export default Auth;
