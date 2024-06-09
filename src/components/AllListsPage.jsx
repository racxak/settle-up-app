import "./AllListsPage.css";
import IconButtonAdd from "../assets/icon-button-add.png";
import { useRef, useState, useContext, useEffect } from "react";
import Modal from "./modal/Modal";
import Button from "./Button";
import "./auth/Form.css";
import { GoPlus } from "react-icons/go";
import ListPanel from "./ListPanel";
import Navbar from "./navbar/Navbar";
import { AuthContext } from "../contexts/authContext";
import { API } from "../listy";
import { RiDeleteBin2Line } from "react-icons/ri";

export default function AllListsPage() {
	const dialog = useRef();

	//testowe
	const [lists, setLists] = useState([]);
	const [members, setMembers] = useState([]);
	const { token, userId } = useContext(AuthContext);
	const [errorMsg, setErrorMsg] = useState("");
	const [errorTokenMsg, setErrorTokenMsg] = useState("");
	const [email, setEmail] = useState("");
	const [listName, setListName] = useState("");
	const [invitationCode, setInvitationCode] = useState("");

	function handleDialogOpen() {
		dialog.current.open();
	}

	useEffect(() => {
		if (token && userId) {
			fetchShoppingLists();
		}
	}, [token, userId]);

	const fetchShoppingLists = async () => {
		const url = `${API}/shopping-lists?userId=${userId}&offset=0&limit=1000`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setLists(data.page);
			} else {
				console.error("Failed to fetch shopping lists");
			}
		} catch (error) {
			console.error(
				"An unexpected error occurred while fetching shopping lists"
			);
		}
	};

	function handleDialogClose() {
		setListName("");
		setMembers([]);
		setErrorMsg("");
		setErrorTokenMsg("");
		dialog.current.close();
	}

	const handleAddNewMember = () => {
		if (email) {
			setMembers((prevMembers) => [...prevMembers, email]);
			setEmail("");
		}
	};

	const handleCreateList = async (e) => {
		e.preventDefault();

		const newList = {
			name: listName.trim(),
			ownerId: userId,
			members: members,
		};

		const url = API + `/shopping-lists?userId=${userId}`;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newList),
			});

			if (response.ok) {
				fetchShoppingLists();
				setErrorMsg("");
				setErrorTokenMsg("");
				handleDialogClose();
			} else if (response.status !== 201) {
				setErrorMsg(
					"An unexpected error occurred - make sure that the added e-mails belong to users registered in the application and that the name of the list is provided"
				);
				setErrorTokenMsg("");
			}
		} catch (error) {
			setErrorMsg("An unexpected error occurred");
			setErrorTokenMsg("");
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddNewMember();
		}
	};

	const handleJoinList = async (e) => {
		e.preventDefault();
		const consumeInvitation = {
			userId: userId,
			token: token.trim(),
		};
		const url = API + `/invitations/tokens`;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(consumeInvitation),
			});

			if (response.status === 501) {
				setErrorTokenMsg("Not implemented yet");
				setErrorMsg("");
			} else if (response.ok) {
				fetchShoppingLists();
				setErrorTokenMsg("");
				handleDialogClose();
				setErrorMsg("");
			} else {
				const errorData = await response.json();
				setErrorTokenMsg(
					errorData.message ||
						`Error: ${response.status} ${response.statusText}`
				);
				setErrorMsg("");
			}
		} catch (error) {
			setErrorTokenMsg("An unexpected error occurred");
			setErrorMsg("");
			console.error(error);
		}
	};

	const deleteItem = (indexToDelete) => { setMembers(prevMembers => prevMembers.filter((_, index) => index !== indexToDelete));
    }
	return (
		<>
			<div id="scrollbar" className="lists-page">
				<Navbar>
					<h2 className="lists">LISTS</h2>
				</Navbar>

				{lists && lists.length != 0 && (
					<div id="scrollbar" className="lists-container">
						{lists.map((list) => (
							<ListPanel
								key={list.id}
								name={list.name}
								listId={list.id}
								owner={list.owner}
								userBalance={list.userBalance}
							></ListPanel>
						))}
					</div>
				)}

				{lists && lists.length == 0 && (
					<div className="empty-info">
						<p> There's nothing here yet.</p>
						<p>Add your first team and take control of your finances.</p>
					</div>
				)}

				<button className="add-button button-icon" onClick={handleDialogOpen}>
					<img src={IconButtonAdd} alt="icon-button-add" />
				</button>
			</div>
			<Modal ref={dialog} onClose={handleDialogClose}>
				<h3 className="add-new-list-container-header">
					Create a new list or join an existing one
				</h3>
				<form className="new-list" onSubmit={handleCreateList}>
					<label>List name</label>
					<input
						type="text"
						onChange={(e) => setListName(e.target.value)}
						value={listName}
					/>
					<p id="add-team-member">Add team member</p>
					<label>Email</label>
					<div className="input-with-button" onKeyDown={handleKeyPress}>
						<input
							type='email'
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						></input>
						<span className="add-new-list-member">
							<GoPlus
								onClick={handleAddNewMember}
								className="add-new-list-member-btn"
							/>
						</span>
					</div>
					<ul className={members && members.length > 0 ? "" : "hidden"}>
						{members &&
							members.map((member, index) => (
								<span className="single-member-wrapper">
									<li key={index}>{member}</li>
									<RiDeleteBin2Line className="delete-item" onClick={() => deleteItem(index)}/>
								</span>
							))}
					</ul>

					{errorMsg && <p className="error-msg">{errorMsg}</p>}

					<div className="divider-with-text">
						<hr />
						<p className="divider-text">or join an existing one</p>
						<hr />
					</div>
					<label>Invitation code</label>

					<input
						type="text"
						onChange={(e) => setInvitationCode(e.target.value)}
						value={invitationCode}
						style={{ marginBottom: errorTokenMsg ? "0" : "" }}
					></input>

					{errorTokenMsg && <p className="error-msg">{errorTokenMsg}</p>}
					<div className="buttons-container">
						<Button onClick={handleJoinList}> Join list</Button>
						<Button style={"filled"} type="submit">
							Create list
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
}
