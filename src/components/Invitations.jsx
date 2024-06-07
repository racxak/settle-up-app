import { useContext, useState } from "react";
import { GoPlus } from "react-icons/go";
import { API } from "../listy";
import "./Invitations.css"
import { AuthContext } from "../contexts/authContext";

export default function Invitations({ listId }) {
	const [email, setEmail] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [succcesMsg, setSuccesMsg] = useState("");
  const [invitations, setInvitations] = useState([]);
	const { token} = useContext(AuthContext);


	const handleAddNewListMember = async (e) => {
    
		e.preventDefault();
		const newMember = {
			listId: listId,
			receiverEmail: email.trim(),
		};
		const url = `${API}/invitations`;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newMember),
			});

			if (response.ok) {
				setSuccesMsg(`Invitation sent to  ${email} successfully`);
				setErrorMsg("");
			} else if (response.status !== 201) {
				setSuccesMsg("");
				setErrorMsg(response.message);
			}
		} catch (error) {
			setSuccesMsg("");
			setErrorMsg("An unexpected error occurred");
		}
	};


  const fetchInvitations = async (invitationStatus) => {
		const url = `${API}/invitations?offset=0&limit=1000&listId=${listId}&invitationStatus=${invitationStatus}`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`
				},
			});

			if (response.ok) {
				const data = await response.json();
				setInvitations(data.page);
			} else {
				console.error("Failed to fetch list invitations");
			}
		} catch (error) {
			console.error(
				"An unexpected error occurred while fetching list invitations"
			);
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddNewListMember();
		}
	};

	return (
		<>
			<form className="new-list">
				<h3 className="add-new-list-container-header">Invitations</h3>
				<label>Add new member to list</label>
				<div className="input-with-button" onKeyDown={handleKeyPress}>
					<input
						type="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder="new-member@gmail.com"
					/>
					<span className="add-new-list-member">
						<GoPlus
							onClick={handleAddNewListMember}
							className="add-new-list-member-btn"
						/>
					</span>
				</div>
				{succcesMsg && <p>{succcesMsg}</p>}
			</form>
      <div className="invitation-status">
			<span className="invitations-btns-wrapper">
      <button onClick={()=>fetchInvitations("PENDING")}>Pending</button>
      <button onClick={()=>fetchInvitations("ACCEPTED")}>Accepted</button>
      <button onClick={()=>fetchInvitations("REJECTED")}>Rejected</button>
			</span>
       {invitations.length !== 0 && 
       invitations.map((invitation)=><div key={invitation.id}>{invitation.receiver.name} </div>)
       
       }
      </div>
		</>
	);
}
