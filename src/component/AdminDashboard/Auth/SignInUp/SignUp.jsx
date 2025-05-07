import React from "react";
import axios from "axios";
import "./Style.css";
import { MdLogout } from "react-icons/md";
import { SiGnuprivacyguard } from "react-icons/si";
import IconWithTitle from "../../../utilities/IconsTittle";


const api = axios.create({
  baseURL: 'https://myrevisionplus.com/api/v1', 
});


const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;

    try {
      const response = await api.post("/signup", { 
        name,
        email,
        password
      });

      const token = response.data.token; 
      alert(`You have successfully signed up! Your token is: ${token}`);
      localStorage.setItem("token", token);
      setAuthToken(token); 
      setState({
        name: "",
        email: "",
        password: ""
      });

    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response) {
    
        alert(`Error: ${error.response.data.message || "There was an error signing up. Please try again."}`);
      } else {
    
        alert("There was an error signing up. Please check your network connection and try again.");
      }
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form className="form" onSubmit={handleOnSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
     
        <IconWithTitle
          icon={SiGnuprivacyguard}
          title="Create Account"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />
        <input
          className="input"
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          className="input"
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "5px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
