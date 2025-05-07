import React, { useState } from 'react'
import SignUpForm from './SignUp';

import './Style.css';
import StudentSignin from './StudentSignin';
const StudentContinue = () => {
      const [type, setType] = useState("signIn");
      const handleOnClick = text => {
        if (text !== type) {
          setType(text);
          return;
        }
      };
      const containerClass =
        "container " + (type === "signUp" ? "right-panel-active" : "");
      return (
        <div className="text-center" style={{ display: 'flex',alignItems:"center",justifyContent:"center" }}>
          {/* <h2>Login To Your Account</h2> */}
          <div className={containerClass} id="container"   style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          maxWidth: '900px',
          margin: '5%',
          position: 'relative'
        }} >
            <SignUpForm />
            <StudentSignin />
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>Welcome Back!</h1>
                  <p style={{color:"#fff"}}> 
                    To keep connected with us please login with your personal info
                  </p>
                  <button
                    className="ghost"
                    id="signIn"
                    onClick={() => handleOnClick("signIn")}
                  >
                    Login
                  </button>
                </div>
                <div className="overlay-panel overlay-right text-white" >
                  <h1 style={{color:"#fff"}}>Welcome To MyRevesion<sup>+</sup> !</h1>
                  <p>Enter your personal details and start journey with us</p>
                  <button
                    className="ghost "
                    id="signUp"
                    onClick={() => handleOnClick("signUp")}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    



export default StudentContinue