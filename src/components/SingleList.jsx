import { useLocation, useParams } from "react-router-dom";
import IconTransactions from "../assets/icon-transactions.png";
import IconUsers from "../assets/icon-users.png";
import Modal from "./modal/Modal";
import "./SingleList.css";
import { useContext, useEffect, useState, useRef } from "react";
import ShoppingList from "./ShoppingList";
import Navbar from "./navbar/Navbar";
import { API } from "../listy";
import { AuthContext } from "../contexts/authContext";
import Invitations from "./Invitations";
import { TiUserAddOutline } from "react-icons/ti";
import { GoArrowRight } from "react-icons/go";
import EmailDropdown from "./EmailDropdown";
import ArrowIcon from "../assets/arrow-icon.png";

export default function SingleList() {
	const { listId } = useParams();
	const dialog = useRef();

	const [transferAmount, setTransferAmount] = useState(null);
	const { token, userId } = useContext(AuthContext);
	const [usersOrTransactionsActive, setUsersOrTransactionsActive] =
		useState("");
	const [debtsShown, setDebstShown] = useState(true);
	const [listData, setListData] = useState([]);
	const [items, setItems] = useState([]);
	const [members, setMembers] = useState([]);
	const [userBalance, setUserBalance] = useState(0);
	const [allPayments, setAllPayments] = useState([]);

	useEffect(() => {
		if (token) {
			fetchShoppingList();
			fetchShoppingListItems();
			fetchUserBalance();
		}
	}, [token]);

	const [selectedUserId, setSelectedUserId] = useState(null);

	const handleUserSelect = (userId) => {
		setSelectedUserId(userId);
	};

	function handleDeptsShown() {
		setDebstShown((prev) => !prev);
	}

	function sideBarChange(change) {
		setUsersOrTransactionsActive((prev) => {
			if (change === "transactions" && change !== prev) {
				fetchShoppingListMembers();
				fetchAllTransactions();
				return "transactions";
			} else if (change === "users" && change !== prev) {
				fetchShoppingListMembers();
				return "users";
			} else {
				return "";
			}
		});
	}

	const fetchShoppingList = async () => {
		const url = `${API}/shopping-lists/${listId}`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setListData(data);
			} else {
				console.error("Failed to fetch shopping lists");
			}
		} catch (error) {
			console.error(
				"An unexpected error occurred while fetching shopping lists"
			);
		}
	};

	const fetchShoppingListItems = async () => {
		const url = `${API}/shopping-lists/${listId}/items?sort=id,desc`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const items = await response.json();
				setItems(items.page);
			} else {
				console.error("Failed to fetch shopping list items");
			}
		} catch (error) {
			console.error(
				"An unexpected error occurred while fetching shopping list items"
			);
		}
	};

	const fetchShoppingListMembers = async () => {
		const url = `${API}/shopping-lists/${listId}/members`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const members = await response.json();
				setMembers(members.page);
			} else {
				console.error("Failed to fetch shopping list members");
			}
		} catch (error) {
			console.error(
				"An unexpected error occurred while fetching shopping list members"
			);
		}
	};

	function handleDialogClose() {
		dialog.current.close();
	}

	function handleDialogOpen() {
		dialog.current.open();
	}

	const fetchUserBalance = async () => {
		const url = `${API}/shopping-lists/${listId}/balances/${userId}`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setUserBalance(data.balance);
			} else {
				console.error("Failed to fetch user balance");
			}
		} catch (error) {
			console.error("An unexpected error occurred while fetching user balance");
		}
	};

	const fetchAllTransactions = async () => {
		const url = `${API}/shopping-lists/${listId}/payments`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setAllPayments(data);
			} else {
				console.error("Failed to fetch payments");
			}
		} catch (error) {
			console.error("An unexpected error occurred while fetching payments");
		}
	};

	const handleSettleUp = async () => {
		const url = `${API}/shopping-lists/${listId}/payments/resolve`;

		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				console.log("SETTLE UP");
				fetchAllTransactions();
			} else {
				console.error("Failed to settle up");
			}
		} catch (error) {
			console.error("An unexpected error occurred while settle up");
		}
	};

	const handlePaymentBetweenTwoUsers = async () => {
		const url = `${API}/shopping-lists/${listId}/payments`;
    if(transferAmount!==0 && selectedUserId!==null){
		const transferData = {
			fromUserId: Number(userId),
			toUserId: selectedUserId,
			amount: Number(transferAmount),
		};
		console.log(transferData);
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(transferData),
			});

			if (response.ok) {
				setTransferAmount(null);
				fetchAllTransactions();	
			}
		} catch (error) {
			console.log("An unexpected error occurred");
		}}
    // to do komunikat błedu
	};

	return (
		<div id="scrollbar" className="single-list-page">
			<Navbar>
				<span
					onClick={handleDeptsShown}
					id="horizontal-layout"
					className="placement"
				>
					<h2 id="list-name"> {listData.name} </h2>
					<h2 id="list-id">#{listId}</h2>
				</span>
			</Navbar>

			{debtsShown && (
				<div id="debts">
					<span id="horizontal-layout">
						<div id="line"></div>
						<p id="owe"> {userBalance}zł </p>
					</span>
				</div>
			)}

			<div id="shopping-list-wrapper">
				<ShoppingList
					initialItems={items}
					getItems={fetchShoppingListItems}
					listId={listId}
					settleUp={handleSettleUp}
				></ShoppingList>

				<div id="user-or-event-wrapper">
					<div id="horizontal-layout" className="user-or-event-btn">
						<img
							onClick={() => sideBarChange("transactions")}
							id="icon-trasactions"
							src={IconTransactions}
							alt="icon-trasactions"
						/>
						<img
							onClick={() => sideBarChange("users")}
							id="icon-users"
							src={IconUsers}
							alt="icon-users"
						/>
					</div>

					{/* Lista członków grupy */}
					{usersOrTransactionsActive === "users" && (
						<div className="users-or-transactions-container users-list">
							<TiUserAddOutline
								onClick={handleDialogOpen}
								className="add-new-member-btn"
							/>
							<Modal ref={dialog} onClose={handleDialogClose}>
								<Invitations listId={listId} />
							</Modal>
							{members.map((member) => (
								<div key={member.id}>
									<p className="member-name"> {member.name}</p>
									<p className="member-email"> {member.email}</p>
									<hr />
								</div>
							))}
						</div>
					)}

					{/* Lista transakcji listy */}
					{usersOrTransactionsActive === "transactions" && (
						<div className="users-or-transactions-container transactions-lists">
							<p style={{ fontWeight: "bold" }}>Make a transfer</p>
							<span className="transfer">
								<input type="number" placeholder="$$$" value={transferAmount} onChange={(e)=>setTransferAmount(e.target.value)}/>
								<p>zł to</p>
								<EmailDropdown
									users={members}
									onUserSelect={handleUserSelect}
								/>
								<GoArrowRight className="send-transfer" onClick={handlePaymentBetweenTwoUsers}/>
							</span>
							<p style={{ fontWeight: "bold" }}>All debts</p>

							{allPayments.length === 0 && <p>Nothing here yet</p>}
							{allPayments &&
								allPayments.map((payment) => (
									<p>
										<span>
											{payment.fromUser.name} owes {payment.toUser.name}{" "}
										</span>
										<span
											style={{
												color: "var(--accent-color)",
												fontWeight: "bold",
											}}
										>
											{payment.amount}zł{" "}
										</span>
									</p>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
