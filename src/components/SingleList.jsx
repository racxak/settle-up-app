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

export default function SingleList() {
	const { listId } = useParams();
	const dialog = useRef();

	const [transferData, setTransferData] = useState({
		fromUserId : 0,
    toUserId: 0,
    amount: 0
	});
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

	function handleDeptsShown() {
		setDebstShown((prev) => !prev);
	}

	function sideBarChange(change) {
		setUsersOrTransactionsActive((prev) => {
			if (change === "transactions" && change !== prev) {
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
		const url = `${API}/shopping-lists/${listId}/items`;
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
		const url = `${API}/shopping-lists/${listId}/items/`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
			}
		} catch (error) {
			console.log("An unexpected error occurred");
		}
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
						{" "}
						<div id="line"></div>
						<p id="owe"> You owe overall {userBalance}zł </p>
					</span>
				</div>
			)}

			{/* {debtsShown &&
      <div id="debts">
      {iOwn.map(item => (
      <span id="horizontal-layout"> <div id="line"></div><p id="owe" key={item.name}> You owe {item.amount}zł to {item.name}  </p></span>
      ))}
      
      {owned.map(item => (
       <span id="horizontal-layout">  <div id="line"></div><p id="owes" key={item.name}> {item.name} owes you {item.amount}zł</p> </span>
      ))}
      </div>
} */}

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
							<span style={{ display: "flex", flexDirection: "row" }}>
								<input
									style={{ width: "1rem" }}
									type="text"
									placeholder="$$$"
								/>
								<p>to</p> <input style={{ width: "3rem" }} type="email" />
								<button>send</button>{" "}
							</span>
							<p style={{ fontWeight: "bold" }}>All transactions</p>

							{allPayments.length === 0 && <p>Nothing here yet</p>}
							{allPayments &&
								allPayments.map((payment) => (
									<span>
										{payment.fromUser.name}
										<GoArrowRight />
										{payment.toUser.name} {payment.amount}zł
									</span>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
