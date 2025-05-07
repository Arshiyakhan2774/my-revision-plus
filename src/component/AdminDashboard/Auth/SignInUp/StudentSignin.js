import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Style.css";
import { login, loginUser, setToken } from "../../store/AuthSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 

const api = axios.create({
  baseURL: 'https://myrevisionplus.com/api/v1/',
});

function StudentSignin() {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="form-container sign-in-container" style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <form className="form" onSubmit={handleOnSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h1>Log In</h1>
        <button
          type="button"
          style={{
            padding: "12px",
            backgroundColor: "#ff4b2b",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          Login My Revision<sup>+</sup>
        </button>
      

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />

        <div style={{ position: "relative" }}>
          <input
            className="input"
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            style={{
              padding: "10px 70px 10px 10px", 
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%", 
            }}
            required
          />

          {passwordVisible ? (
            <AiOutlineEyeInvisible
              size={24}
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "black",
              }}
            />
          ) : (
            <AiOutlineEye
              size={24}
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                color: "black",
                border: "none",
                cursor: "pointer",
              }}
            />
          )}
        </div>

        <a href="#" style={{ color: "#003087", textDecoration: "none" }}>Forgot your password?</a>
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#ff4b2b",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default StudentSignin