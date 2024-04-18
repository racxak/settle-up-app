import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./Form.css";

export default function Form() {
	const [form, setForm] = useState("login");

	function changeForm(formName) {
		setForm(formName);
	}

	return (
		<>
			{form === "login" && <Login changeForm={changeForm} />}
			{form === "register" && <Register changeForm={changeForm} />}
		</>
	);
}
