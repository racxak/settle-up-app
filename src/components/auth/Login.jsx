import React from "react";
import usePasswordToogle from "../../hooks/usePasswordToogle";
import ArrowIcon from "../../assets/arrow-icon.png";
import { useNavigate } from "react-router-dom";

export default function Login({ changeForm }) {
	const [InputType, Icon] = usePasswordToogle();
	const navigate = useNavigate();

	function handleLogin() {
		navigate("/lists");
	}

	return (
		<form className="form-login-register" onSubmit={handleLogin}>
			<label> Email </label>
			<input type="email" required placeholder="jhon@email.com"></input>

			<label> Password </label>

			<div className="input-with-button">
				<input type={InputType} required placeholder="**********" />
				<span className="password-toggle-icon">{Icon}</span>
			</div>

			<div className="form-buttons-layout">
				<span>
					You dont have an account yet?
					<button onClick={() => changeForm("register")}>Sign up</button>
				</span>
				<button type="submit">
					<img src={ArrowIcon} alt="arrow-icon" />
				</button>
			</div>
		</form>
	);
}
