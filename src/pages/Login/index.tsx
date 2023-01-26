import React, { useState } from "react";
import { SignInValues } from "../../interfaces/user";
import styles from "./styles.module.scss";

const Login: React.FC = () => {
  const [inputValues, setInputValues] = useState<SignInValues>({
    password: "",
    username: "",
  });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.login}>
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
        <label htmlFor="username">
          Password:
          <input
            onChange={inputChangeHandler}
            name="password"
            type="password"
            value={inputValues.password}
          />
        </label>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default Login;
