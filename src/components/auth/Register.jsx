import React, { useState } from "react";
import usePasswordToogle from "../../hooks/usePasswordToogle";
import ArrowIcon from "../../assets/arrow-icon.png";
import {API } from "../../listy.js"

export default function Register({ changeForm }) {
	const [InputType, Icon] = usePasswordToogle();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const specialCharacters = "!@#%^&*.";
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const hasNumber = /\d/; 
	const hasSpecialChar = new RegExp(`[${specialCharacters.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`); 


	const handleSignUp = async (e) => {
    e.preventDefault();

		if (password.length > 5 && hasNumber.test(password) && hasSpecialChar.test(password)) {
			setFirstName(prev => prev.charAt(0).toUpperCase() + prev.slice(1).toLowerCase());
      setLastName ((prev) => prev.charAt(0).toUpperCase() + prev.slice(1).toLowerCase());

		const user = {
      firstname: firstName,
      lastname: lastName,
      email,
      password
    };
		const url = API + "/users/register";
    try {
			const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        setSuccessMsg("User registered successfully!");
        setErrorMsg("");
      } else if(response.status===500) {
			setErrorMsg('This email has already been registered');
			setSuccessMsg("");}
			else{
        setErrorMsg('Error registering user');
        setSuccessMsg("");
      }
    } catch (error) {
      setErrorMsg('An unexpected error occurred');
      setSuccessMsg("");
    }
	}
  };

	
	return (
		<form className="form-login-register register" onSubmit={handleSignUp}>
			<label> First name </label>
			<input
				type="text"
				required
				placeholder="Jhon"
				onChange={(e) => setFirstName(e.target.value)}
				value={firstName}
			></input>

		<label> Last name </label>
			<input
				type="text"
				required
				placeholder="Doe"
				onChange={(e) => setLastName(e.target.value)}
				value={lastName}
			></input>


			<label> Email </label>
			<input
				type="email"
				required
				placeholder="jhon@email.com"
				onChange={(e) => setEmail(e.target.value)}
				value={email}
			></input>

			<label> Password </label>
			<div className="input-with-button">
				<input
					type={InputType}
					required
					placeholder="**********"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				></input>
				<span className="password-toggle-icon">{Icon}</span>
			</div>
			{(password.length > 0 && (password.length <= 5 || !hasNumber.test(password) || !hasSpecialChar.test(password))) && <p className="error-msg password-too-week">Password is too weak - should contain a special character, a number and at least 6 characters</p>}
			{successMsg && <p className="success-msg">{successMsg}</p>}
      {errorMsg && <p className="error-msg">{errorMsg}</p>}

			<div className="form-buttons-layout">
				<span>
					Already have an account?{" "}
					<button type="button" onClick={() => changeForm("login")}> Sign in</button>
				</span>
				<button type="submit">
					<img src={ArrowIcon} alt="arrow-icon" />
				</button>
			</div>
		</form>
	);
}
