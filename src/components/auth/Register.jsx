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

	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const handleSignUp = async (e) => {
    e.preventDefault();

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

			{successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

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
