import { useContext, useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { API } from "../listy";
import "./Invitations.css";
import { AuthContext } from "../contexts/authContext";

export default function Invitations({ listId }) {
	const [email, setEmail] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [succcesMsg, setSuccesMsg] = useState("");
	const [invitations, setInvitations] = useState([]);
	const [invitationToken, setInvitationToken] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState("");

	const { token } = useContext(AuthContext);

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
				setEmail("");
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

	const createInvitationToken = async () => {
		const url = `${API}/invitations/${listId}/tokens`;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setInvitationToken(data);
				fetchInvitations("PENDING");
			}
		} catch (error) {
			console.log(error);
		}
		setEmail("");
	};

	const fetchInvitations = async (invitationStatus) => {
		const url = `${API}/invitations?offset=0&limit=1000&listId=${listId}&invitationStatus=${invitationStatus}`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setInvitations(data.page);
				setSelectedStatus(invitationStatus);
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

	useEffect(() => {
		createInvitationToken();
	}, []);

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
						style={{ minWidth: "15rem", width: "20vw" }}
					/>
					<span className="add-new-list-member">
						<GoPlus
							onClick={handleAddNewListMember}
							className="add-new-list-member-btn"
						/>
					</span>
				</div>
				{succcesMsg && (
					<p style={{ minWidth: "15rem", width: "20vw" }}>{succcesMsg}</p>
				)}
			</form>
			{/* <p>{invitationToken.token} {invitationToken.validUntil}</p> */}
			<div className="invitation-status">
				<span className="invitations-btns-wrapper">
					<button
						style={{ color: selectedStatus === "PENDING" ? "#CD3AFF" : "" }}
						onClick={() => fetchInvitations("PENDING")}
					>
						Pending
					</button>
					<button
						style={{ color: selectedStatus === "ACCEPTED" ? "#CD3AFF" : "" }}
						onClick={() => fetchInvitations("ACCEPTED")}
					>
						Accepted
					</button>
					<button
						style={{ color: selectedStatus === "REJECTED" ? "#CD3AFF" : "" }}
						onClick={() => fetchInvitations("REJECTED")}
					>
						Rejected
					</button>
				</span>
				{invitations.length !== 0 &&
					invitations.map((invitation) => (
						<p key={invitation.id} style={{ textTransform: "capitalize" }}>
							{invitation.receiver.name}{" "}
						</p>
					))}
			</div>
		</>
	);
}
