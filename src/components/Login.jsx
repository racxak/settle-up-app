import React from "react"
import { Link } from "react-router-dom";
import usePasswordToogle from "../hooks/usePasswordToogle";
import ArrowIcon from '../assets/arrow-icon.png'

export default function Login ({changeForm}) {
  const [InputType, Icon] = usePasswordToogle();
  
	return (
			<form className="form-login-register">
		
				<label> Email </label>
				<input type="email" required placeholder="jhon@email.com"
				></input>

				<label> Password </label>

        <div className="password-container">
          <input type={InputType} required placeholder="**********" 
          />
          <span className="password-toggle-icon">{Icon}</span>
        </div>

      <div className="form-buttons-layout">
      <span>You dont have an account yet? <button onClick={()=>changeForm("register")}>Sign up</button></span>
      <button type="submit">
					<img src={ArrowIcon} alt="arrow-icon" />
				</button>
     </div>
			</form>
	);
};