import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styles from "./styles.module.scss";
import { SignUpValues } from "../../interfaces/user";
import eye_show from "../../assets/svg/eye_show.svg";
import eye_hide from "../../assets/svg/eye_hide.svg";

interface IRegisterPostRes {
  success: true;
}

const Register: React.FC = () => {
  const [inputValues, setInputvalues] = useState<SignUpValues>({
    email: "",
    password: "",
    username: "",
    verify_password: "",
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
    if (inputValues.password !== inputValues.verify_password) {
      setErrorMessage("Entered passwords does not match");
      return false;
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
            type="email"
            name="email"
            value={inputValues.email}
            minLength={5}
            required
          />
          <label htmlFor="email">Email</label>
        </div>
        <div>
          <input
            onChange={inputChangeHandler}
            type={showPassword.first ? "text" : "password"}
            name="password"
            value={inputValues.password}
            minLength={5}
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
        <div>
          <input
            onChange={inputChangeHandler}
            type={showPassword.last ? "text" : "password"}
            name="verify_password"
            value={inputValues.verify_password}
            minLength={5}
            required
          />
          <label htmlFor="verify_password">Verify password</label>
          <span
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, last: !prev.last }))
            }
          >
            <img
              src={showPassword.last ? eye_hide : eye_show}
              alt="show-hide password"
            />
          </span>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Register;
