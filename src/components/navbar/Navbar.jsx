import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AiOutlineLogout } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import { API } from "../../listy";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const updateInvitation = async (invitationId, status, token) => {
	const url = `${API}/invitations/${invitationId}`;

	const body = {
		status: status,
	};

	try {
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			const data = await response.json();
			console.log("Invitation updated successfully", data);
		} else {
			console.error("Failed to update the invitation");
		}
	} catch (error) {
		console.error(
			"An unexpected error occurred while updating the invitation",
			error
		);
	}
};

export default function Navbar({ children, getShoppingLists}) {
	const { logout, userId, token } = useContext(AuthContext);
	const [invitations, setInvitations] = useState([]);
	const [invitationsVisible, setInvitationsVisible] = useState(false);

	const navigate = useNavigate();

	const fetchInvitations = async (userId, token, setInvitations) => {
		const url = `${API}/invitations?offset=0&limit=1000&userId=${userId}&invitationStatus=PENDING`;
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
			} else {
				console.error("Failed to fetch list invitations");
			}
		} catch (error) {
			console.error(
				"An unexpected error occurred while fetching list invitations"
			);
		}
	};

	useEffect(() => {
		if (userId) {
			fetchInvitations(userId, token, setInvitations);
		}
	}, [userId, token]);

	const handleUpdate = async (status, invitationId) => {
		if(status === "ACCEPTED"){
			getShoppingLists();
		}
		updateInvitation(invitationId, status, token);
		await fetchInvitations(userId, token, setInvitations);
	};

	return (
		<div id="navbar-wrapper">
			<div id="page-header">
				<h1 onClick={() => navigate("/lists")}>SETTLEUP</h1>
				<div className="divider"> </div>
				{children}
			</div>
			<div id="buttons-navabr-wrapper">
				<ul>
					<li className="dropdown">
						<a className="dropbtn"onClick={()=>setInvitationsVisible((prev)=>!prev)}> 
							Invitations to lists
						</a>
            {invitations.length !==0 && <div className="ivitations-counter">{invitations.length}</div>}
						<div className={invitationsVisible? "dropdown-content-visible dropdown-content ": "dropdown-content" }>
            {invitations.length === 0 && <span>You don't have any invites </span>}
							{invitations && invitations.map((invitation) => (
								<span key={invitation.id}>
									<p>
										{invitation.list.name} by {invitation.list.owner.name}
									</p>
									<FaCheck
										onClick={() => handleUpdate("ACCEPTED", invitation.id)}
									/>
									<IoClose
										onClick={() => handleUpdate("REJECTED", invitation.id)}
									/>
								</span>
							))}
						</div>
					</li>
					<li className="logout" onClick={() => logout()}>
						Logout <AiOutlineLogout />
					</li>
				</ul>
			</div>
		</div>
	);
}
