import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { SignInValues } from "../../interfaces/user";
import styles from "./styles.module.scss";
import eye_show from "../../assets/svg/eye_show.svg";
import eye_hide from "../../assets/svg/eye_hide.svg";

interface IRegisterPostRes {
  success: true;
}

const Login: React.FC = () => {
  const [inputValues, setInputvalues] = useState<SignInValues>({
    password: "",
    username: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState({
    first: false,
    last: false,
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
    },
    onSuccess: (res) => {
      navigate("/user/dashboard");
    },
  });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setInputvalues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkInputs = () => {
    if (!formRef.current) return false;
    const form = formRef.current;
    const inputs = Array.from(form.getElementsByTagName("input"));
    const invalidInput = inputs.find((input) => !input.validity.valid);
    if (invalidInput) {
      const { name, minLength } = invalidInput;
      const { valueMissing, typeMismatch, tooShort } = invalidInput.validity;
      if (tooShort) {
        setErrorMessage(
          `Input ${name} should contain at least ${minLength} characters`
        );
        return false;
      } else if (valueMissing) {
        setErrorMessage(`Please fill input ${name}`);
        return false;
      } else if (typeMismatch) {
        setErrorMessage(`Please write valid ${name}`);
        return false;
      }
    }
    return true;
  };

  const sumbitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = checkInputs();
    if (!isValid) return;
    mutate();
  };

  return (
    <div className={styles.auth}>
      <h1>Join us</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={sumbitHandler} noValidate ref={formRef}>
        <div>
          <input
            onChange={inputChangeHandler}
            type="text"
            name="username"
            value={inputValues.username}
            minLength={5}
            required
          />
          <label htmlFor="username">Username</label>
        </div>
        <div>
          <input
            onChange={inputChangeHandler}
            type={showPassword.first ? "text" : "password"}
            name="password"
            value={inputValues.password}
            minLength={8}
            required
          />
          <label htmlFor="password">Password</label>
          <span
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, first: !prev.first }))
            }
          >
            <img
              src={showPassword.first ? eye_hide : eye_show}
              alt="show-hide password"
            />
          </span>
        </div>
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
