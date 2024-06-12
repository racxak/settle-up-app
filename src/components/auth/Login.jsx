import React, { useState, useContext } from "react";
import usePasswordToogle from "../../hooks/usePasswordToogle";
import ArrowIcon from "../../assets/arrow-icon.png";
import { useNavigate, } from "react-router-dom";
import { API  } from "../../listy";
import { AuthContext } from "../../contexts/authContext";
import { jwtDecode } from "jwt-decode";


export default function Login({ changeForm }) {
	const [InputType, Icon] = usePasswordToogle();
	const navigate = useNavigate();
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
  const [authData, setAuthData] = useState({ email: 's@gmail.com', password: '123456' });
  const { login } = useContext(AuthContext); 

	 const handleLogin = async (e) => {
		 e.preventDefault();
    
		const auth = {
      email: authData.email,
      password: authData.password,
    };
	
		const url = API + "/auth";
    try {
			const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auth)
      });

      if (response.ok) {
				const data = await response.json();
        setSuccessMsg("User logged in successfully!");
        setErrorMsg("");
				const userId = jwtDecode(data.jwt).id;
        login(data.jwt, userId);
				navigate("/lists");
	  	} else if(response.status===403) {
			setErrorMsg('Invalid credentials');
			setSuccessMsg("");}
			else{
        setErrorMsg('Error while logging in');
        setSuccessMsg("");
      }
    } catch (error) {
      setErrorMsg('An unexpected error occurred');
      setSuccessMsg("");
    }
  };

	return (
		<form className="form-login-register" onSubmit={handleLogin}>
			<label> Email </label>
			<input type="email" required placeholder="jhon@email.com"  onChange={(e)=> setAuthData({ ...authData, email: e.target.value })}></input>
			<label> Password </label>

			<div className="input-with-button">
				<input  style={{ marginBottom: errorMsg || successMsg ? '0' : '3vh' }} type={InputType} required placeholder="**********" onChange={(e)=>  setAuthData({ ...authData, password: e.target.value })} />
				<span className="password-toggle-icon">{Icon}</span>
			</div>
			{successMsg && <p className="success-msg">{successMsg}</p>}
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
			<div className="form-buttons-layout">
				<span>
					You dont have an account yet?	{" "} 
					<button type="button" onClick={() => changeForm("register")}>Sign up</button>
				</span>
				<button type="submit">
					<img src={ArrowIcon} alt="arrow-icon" />
				</button>
			</div>
		</form>
	);
}
