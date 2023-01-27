import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { SignInValues } from "../../interfaces/user";
import styles from "./styles.module.scss";

interface IRegisterPostRes {
  success: true;
}
interface IRegisterError {
  success: true;
  msg?: string;
}

const Login: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState<SignInValues>({
    password: "",
    username: "",
  });
  const { mutate } = useMutation<IRegisterPostRes, Error>({
    mutationFn: () => {
      const { username, password } = inputValues;
      return fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
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
    setShowError(false);
    const { name, value } = e.currentTarget;

    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkInputs = () => {
    const { username, password } = inputValues;
    if (!username || !password) {
      setErrorMessage("Please fill all inputs");
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errorMessage) return setShowError(true);
    mutate();
  };

  return (
    <div className={styles.login}>
      {showError && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          onChange={inputChangeHandler}
          type="text"
          name="username"
          value={inputValues.username}
        />
        <label htmlFor="password">Password:</label>
        <input
          onChange={inputChangeHandler}
          type="password"
          name="password"
          value={inputValues.password}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Login;

/*

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


*/
