import React, { useContext, useState, useEffect, useRef } from "react";
import AddIcon from "./../assets/icon-button-add.png";
import Button from "./Button";
import "./ShoppingList.css";
import { API } from "../listy";
import { AuthContext } from "../contexts/authContext";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import Modal from "./modal/Modal";

function ShoppingList({ initialItems, getItems, listId, settleUp }) {
	const [newItem, setNewItem] = useState("");
	const [newItemAmount, setNewItemAmount] = useState("");
	const [bills, setBills] = useState([]);
	const { userId, token } = useContext(AuthContext);
	const [billsActive, setBillsActive] = useState(false);
	const [costs, setCosts] = useState(null);
	const [noCosts, setNoCosts] = useState(false);
	const [editedItem, setEditedItem] = useState(null);
	const [items, setItems] = useState([]);
	const [singleBill, setSingleBill] = useState({});
	const dialog = useRef();

	useEffect(() => {
		const updatedItems = initialItems.map((item) => ({
			...item,
			earlyPurchased: item.purchased,
		}));
		setItems(updatedItems);
	}, [initialItems]);

	const handleToggleView = () => {
		if (!billsActive && bills.length === 0) {
			getAllBills();
		}
		setBillsActive((prev) => !prev);
	};

	const handleAddItem = async () => {
		if (newItem.trim() !== "" && newItemAmount.trim() !== "") {
			const newItemObject = {
				name: newItem,
				quantity: newItemAmount,
			};

			const url = `${API}/shopping-lists/${listId}/items`;
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newItemObject),
				});

				if (response.ok) {
					getItems();
				} else if (response.status !== 201) {
					console.log(response.message);
				}
			} catch (error) {
				console.log("An unexpected error occurred");
			}
			setNewItem("");
			setNewItemAmount("");
		}
	};

	const toggleItemCompletion = (itemId) => {
		setItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId
					? { ...item, earlyPurchased: !item.earlyPurchased }
					: item
			)
		);
	};

	const handleAddBill = async () => {
		if (costs === null) {
			setNoCosts(true);
		} else if (costs > 0) {
			setNoCosts(false);
			const completedItemsIDs = items
				.filter((item) => item.earlyPurchased)
				.map((item) => item.id);
			const newBill = {
				total: costs,
				comment: "",
				itemIds: completedItemsIDs,
				ownerId: userId,
			};

			const url = `${API}/shopping-lists/${listId}/bills`;
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newBill),
				});
				if (response.ok) {
					getAllBills();
					setCosts(0);
					const updatedItems = items.map((item) =>
						item.earlyPurchased
							? { ...item, purchased: true, earlyPurchased: false }
							: item
					);
					setItems(updatedItems);

					for (const item of updatedItems) {
						if (item.purchased) {
							await handleUpdateItem(item.id, item);
						}
					}
				}
			} catch (error) {
				console.log("An unexpected error occurred");
			}
		}
	};

	const handleEditItem = (item) => {
		setEditedItem(item);
	};

	const handleUpdateItem = async (itemId, updatedItem) => {
		const uItem = {
			name: updatedItem.name,
			quantity: updatedItem.quantity,
			purchased: updatedItem.purchased,
		};
		const url = `${API}/shopping-lists/${listId}/items/${itemId}`;
		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(uItem),
			});
			if (response.ok) {
				getItems();
				setEditedItem(null);
			}
		} catch (error) {
			console.log("An unexpected error occurred");
		}
	};

	const getAllBills = async () => {
		const url = `${API}/shopping-lists/${listId}/bills?sort=id,desc`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const fetchedBills = await response.json();
				setBills(fetchedBills.page);
			} else {
				console.error("Failed to fetch shopping list items");
			}
		} catch (error) {
			console.error(
				"An unexpected error occurred while fetching shopping list items"
			);
		}
	};

	const deleteItem = async (itemId) => {
		const url = `${API}/shopping-lists/${listId}/items/${itemId}`;
		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				getItems();
			}
		} catch (error) {
			console.log("An unexpected error occurred");
		}
	};

	const handleClickSettleUp = () => {
		settleUp();
		getAllBills();
	};

	function handleDialogClose() {
		dialog.current.close();
	}
	const hadleFetchSingleBill = async (billId) => {
		const url = `${API}/shopping-lists/${listId}/bills/${billId}`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setSingleBill(data);
				dialog.current.open();
			} else {
				console.error("Failed to fetch shopping lists");
			}
		} catch (error) {
			console.error("An unexpected error occurred while fetching bill");
		}
	};
	return (
		<div id="shopping-list-container">
			<span>
				<button
					className={!billsActive ? "active" : "unactive"}
					onClick={handleToggleView}
				>
					Shopping List
				</button>
				<button
					className={billsActive ? "active" : "unactive"}
					onClick={handleToggleView}
				>
					Bills
				</button>
			</span>

			{/* wyświetlanie listy zakupów */}
			{!billsActive && (
				<>
					<div className="add-new-item-container">
						<form onSubmit={handleAddItem}>
							<input
								type="text"
								value={newItem}
								onChange={(e) => setNewItem(e.target.value)}
								placeholder="Item name"
							/>
							<input
								type="number"
								value={newItemAmount}
								onChange={(e) => setNewItemAmount(e.target.value)}
								placeholder="Item amount"
							/>
							<img
								className="add-btn-small"
								onClick={handleAddItem}
								src={AddIcon}
								alt="icon-add-btn"
							/>
						</form>
					</div>

					<ul id="shopping-list">
						{initialItems &&
							initialItems
								.filter((item) => !item.purchased)
								.map((item) => (
									<li className="list-item" key={item.id}>
										<input
											id="cb"
											type="checkbox"
											checked={item.earlyPurchased}
											onChange={() => toggleItemCompletion(item.id)}
										/>
										{/* { (editedItem === null || (editedItem !== null &&  editedItem.id !== item.id)) && ( */}
										<>
											<span className="item-amount">
												<p>{item.name}</p>
												<p style={{ marginLeft: "1rem" }}>{item.quantity}</p>
											</span>
											<span className="edit-delete">
												{/* <button
													className="edit-item"
													onClick={() => handleEditItem(item)}
												>
													<FiEdit3 />
												</button> */}
												<button
													className="delete-item"
													onClick={() => deleteItem(item.id)}
												>
													<RiDeleteBin2Line />
												</button>
											</span>
										</>
										{/* )} */}
										{/* form podczas edytowania
									{editedItem && editedItem.id === item.id && (
										<div  className="add-new-item-container edit-item-container">
											{/* todo wygląd edytora */}
										{/* <form onSubmit={()=>handleUpdateItem(item.id)}>
											<input
												type="text"
												value={editedItem.name}
												onChange={(e) => setEditedItem(e.target.value)}
												placeholder="Item name"
											/>
											<input
												type="number"
												value={editedItem.quantity}
												onChange={(e) => setEditedItem(e.target.value)}
												placeholder="Item amount"
											/>
											<button type="submit" className="save-btn">
												Save
											</button>
										</form> */}
										{/* </div>
									)} */}
									</li>
								))}
					</ul>

					<div id="horizontal-layout" className="add-bill-container">
						<input
							id="i-paid"
							type="number"
							min="1"
							step="1"
							placeholder="$$$"
							required
							value={costs}
							onChange={(e) => setCosts(e.target.value)}
						/>

						<Button onClick={handleAddBill} className="add-bill-btn">
							add bill
						</Button>
					</div>
					{noCosts && (
						<p className="error-msg list-error">
							Please enter the value you paid.
						</p>
					)}
					{costs < 0 && (
						<p className="error-msg  list-error">
							Please enter the correct value.
						</p>
					)}
				</>
			)}
			{/*Wyświetlanie rachunków */}
			{billsActive && (
				<>
					{bills &&
						bills.map((bill) => (
							<div
								className="bill"
								key={bill.id}
							>
								<p onClick={() => hadleFetchSingleBill(bill.id)}  style={{ opacity: bill.expired ? 0.2 : 1 }}>
									{bill.owner.name} paid <>{bill.total}</> zł
								</p>
								<Modal ref={dialog} onClose={handleDialogClose}>
									<h3 style={{marginBottom: "1rem"}}>
										<span style={{ textTransform: "capitalize"}}>
											{bill.owner.name}{" "}
										</span>
										paid {bill.total} zł for:
									</h3>
									{singleBill &&
										singleBill.items &&
										singleBill.items.map((item) => (
											<li className="list-item" key={item.id}>
												<span className="item-amount">
													<p>{item.name}</p>
													<p style={{ marginLeft: "1rem" }}>{item.quantity}</p>
												</span>
											</li>
										))}
								</Modal>
								<div className="divider bill-divider" />
							</div>
						))}
					<Button className="settle-up-button" onClick={handleClickSettleUp}>
						SettleUp
					</Button>
				</>
			)}
		</div>
	);
}

export default ShoppingList;
