import React, { useState } from "react";
import usePasswordToogle from "../hooks/usePasswordToogle";
import ArrowIcon from '../assets/arrow-icon.png';

export default function Register ({changeForm}) {
  const [InputType, Icon] = usePasswordToogle();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // TODO: errors
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessrMsg] = useState("");
  
  function handleSignUp(e){
    e.preventDefault();
    console.log(fullName, email, password);
  }

	return (
    <form className="form-login-register" onSubmit={handleSignUp}>
      <label> Full Name </label>
        <input type="text" required placeholder="Jhon Doe" onChange={(e)=> setFullName(e.target.value)} value={fullName}
				></input>

      <label> Email </label>
				<input type="email" required placeholder="jhon@email.com" onChange={(e)=> setEmail(e.target.value)} value={email}
				></input>

				<label> Password </label>
        <div className="password-container">
				<input type={InputType} required placeholder="**********"  onChange={(e)=> setPassword(e.target.value)} value={password}
				></input>
         <span className="password-toggle-icon">{Icon}</span>
        </div>
    
    <div className="form-buttons-layout">
    <span>Already have an account? <button onClick={()=>changeForm("login")}>  Sign in</button></span>
     <button type="submit">
       <img src={ArrowIcon} alt="arrow-icon" />
      </button>
    </div>
    </form>
	);
};