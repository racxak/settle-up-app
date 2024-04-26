import "./Auth.css";
import IconQuestionMark from "../../assets/icon-question-mark.png";
import { useRef, useState } from "react";
import Modal from "../modal/Modal";
import Form from "./Form";
export default function Auth() {
	const dialog = useRef();

	//   const [isDialogOpen, setIsDialogOpen] = useState(false);

	function handleDialogOpen() {
		dialog.current.open();
	}

	function handleDialogClose() {}

	return (
		<>
			<h1 className="main-title"> SETTLEUP</h1>

			<div className="circle lightgreen"></div>
			<div className="circle darkgreen"></div>
			<Form></Form>

			<img
				onClick={handleDialogOpen}
				className="btn-question-mark"
				src={IconQuestionMark}
				alt="icon-question-mark"
			/>

			<Modal ref={dialog} onClose={handleDialogClose}>
				<h2>What is settle up?</h2> 
				 <div className="about">
					This app is your personal mediator in the world of finance - ideal for managing your accounts both professionally and privately. Constructed with simplicity in mind, it avoids getting lost in the maze of bills and ambiguous accounts. It is a tool for those who value transparency
					and want to always have their finances under control. Whether it's
					settling accounts in the company or splitting the bill after a joint
					trip with friends, our app provides a clear and simple way to organise
					shared expenses. With us, finances become simple, intuitive and
					stress-free, allowing you to manage your budget with ease and
					convenience. With this app, every transaction is clear as day and you
					can enjoy peace of mind knowing your money is exactly where it should
					be.
				</div> 
			</Modal>
		</>
	);
}
