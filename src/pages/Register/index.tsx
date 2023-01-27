import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styles from "./styles.module.scss";
import { SignUpValues } from "../../interfaces/user";

interface IRegisterPostRes {
  success: true;
}
interface IRegisterError {
  success: true;
  msg?: string;
}

const Register: React.FC = () => {
  const [inputValues, setInputvalues] = useState<SignUpValues>({
    email: "",
    password: "",
    username: "",
    verify_password: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { mutate, data } = useMutation<IRegisterPostRes, Error>({
    mutationFn: () => {
      const { username, password, email } = inputValues;
      return fetch("http://localhost:3000/api/auth/register", {
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
      }).then(async (d) => {
        const res = await d.clone().json();
        if (d.ok && res.success) return d.json();
        throw new Error(res.msg);
      });
    },
    onError: (err) => {
      setErrorMessage(err.message);
      setShowError(true);
    },
    onSuccess: (res) => {
      navigate("/user/dashboard");
    },
  });

  useEffect(() => {
    checkInputs();
  }, [inputValues]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showError) setShowError(false);
    const { name, value } = e.target;
    setInputvalues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkInputs = () => {
    const { username, password, verify_password, email } = inputValues;
    if (!username || !password || !verify_password || !email) {
      setErrorMessage("Please fill all inputs");
    } else if (password !== verify_password) {
      setErrorMessage("Passwords does not match");
    } else {
      setErrorMessage("");
    }
  };

  const sumbitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errorMessage) return setShowError(true);
    mutate();
  };

  return (
    <div className={styles.auth}>
      {showError && <p>{errorMessage}</p>}
      <form onSubmit={sumbitHandler}>
        <label htmlFor="username">Username:</label>
        <input
          onChange={inputChangeHandler}
          type="text"
          name="username"
          value={inputValues.username}
        />
        <label htmlFor="email">Email:</label>
        <input
          onChange={inputChangeHandler}
          type="email"
          name="email"
          value={inputValues.email}
        />
        <label htmlFor="password">Password:</label>
        <input
          onChange={inputChangeHandler}
          type="password"
          name="password"
          value={inputValues.password}
        />
        <label htmlFor="verify_password">Verify password:</label>
        <input
          onChange={inputChangeHandler}
          type="password"
          name="verify_password"
          value={inputValues.verify_password}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Register;
