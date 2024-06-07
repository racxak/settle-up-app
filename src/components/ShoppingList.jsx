import React, {useContext, useState } from 'react';
import AddIcon from "./../assets/icon-button-add.png"
import Button from "./Button"
import "./ShoppingList.css"
import { API } from '../listy';
import { GoX } from "react-icons/go";
import { AuthContext } from '../contexts/authContext';
function ShoppingList({initialItems, getItems, listId}) {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [bills, setBills] = useState([]);
  const {userId, token} = useContext(AuthContext);
  const [billsActive, setBillsActive] = useState (false); 
  const [costs, setCosts] = useState(0);

  const handleToggleView = () => {
    if(!billsActive && bills.length === 0 ){
      getAllBills();
    }
    setBillsActive(prev => !prev);
  };

  const handleAddItem = async() => {
    if (newItem.trim() !== '' && newItemAmount.trim() !== '') {
      const newItemObject = {
        name: newItem,
        quantity: newItemAmount, 
      };

    const url = `${API}/shopping-lists/${listId}/items`;
    try {
			const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItemObject)
      });

      if (response.ok) {
        getItems();
      } else if(response.status!==201) {
			console.log(response.message);}
    } catch (error) {
      console.log('An unexpected error occurred');
    }
      setNewItem(''); 
      setNewItemAmount('');
    }
  };

  const toggleItemCompletion = async(itemId) => {
      const itemToUpdate = initialItems.find(item => item.id === itemId);
      const url = `${API}/shopping-lists/${listId}/items/${itemId}`;
      const updatedItem = {
        name: itemToUpdate.name,
        quantity: itemToUpdate.quantity,
        purchased: !itemToUpdate.purchased, 
      };
  
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedItem)
        });
  
        if (response.ok) {
          getItems();
        } 
      } catch (error) {
        console.log('An unexpected error occurred');
      }
  };


  const handleAddBill = async () => {
    // if (costs && items.some(item => item.purchased)) {
    //   const completedItemsIDs = initialItems.filter(item => item.purchased).map(item => item.id);
      const completedItemsIDs = initialItems.filter(item => item.purchased).map(item => item.id);
      const newBill = {
        total: costs,
        comment: "",
        itemIds: completedItemsIDs,
        ownerId: userId
      };

      console.log(newBill);

      const url = `${API}/shopping-lists/1/bills`;
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
        }
      } catch (error) {
        console.log("An unexpected error occurred");
      }

      // setBills(prevBills => [...prevBills, newBill]);
      // setItems(prevItems => prevItems.filter(item => !item.purchased));
    };
  


  const handleSettleUp = () => {
    // setBills("");
  }

  const getAllBills = async() => {
    const url = `${API}/shopping-lists/${listId}/bills`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const fetchedBills = await response.json();
        setBills(fetchedBills.page);
        console.log(bills);
      } else {
        console.error('Failed to fetch shopping list items');
      }
    } catch (error) {
      console.error('An unexpected error occurred while fetching shopping list items');
    }

  }



  const deleteItem = async(itemId) => {
    console.log("?" + itemId);
    const url = `${API}/shopping-lists/${listId}/items/${itemId}`;
    try {
			const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        getItems();
      }
      } catch (error) {
      console.log('An unexpected error occurred');
      }
    }



  return (
    <div id='shopping-list-container'>
      <span> <button className={!billsActive ? 'active' : 'unactive'} onClick={handleToggleView}>Shopping List</button>
        <button className={billsActive ? 'active' : 'unactive'} onClick={handleToggleView}>Bills</button>
    </span>
    {!billsActive && <>
      <div className='add-new-item-container'>
        <form onSubmit={handleAddItem}>
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="Item name"
          />
         <input
            type="number"
            value={newItemAmount}
            onChange={e => setNewItemAmount(e.target.value)}
            placeholder="Item amount"
          />
      <img className='add-btn-small' onClick={handleAddItem}src={AddIcon} alt="icon-add-btn" />
      </form>
    </div>

      <ul id='shopping-list'>
        {initialItems && initialItems.map(item => (
          <li className="list-item"  key={item.id}>
            <input
              id = "cb"
              type="checkbox"
              checked={item.purchased}
              onChange={() => toggleItemCompletion(item.id)}
            />
            <span className='item-amount'>
            <p>{item.name}</p>
            <p>{item.quantity}</p>
            </span>
            <button className='delete-item' onClick={() => deleteItem(item.id)}><GoX /> </button>
          </li>
        ))}
      </ul>
 
      <div id='horizontal-layout' className='add-bill-container'>
      <input id="i-paid" type="number" placeholder='$$$' required value={costs} onChange={e => setCosts(e.target.value)} />
          <Button onClick={handleAddBill} className="add-bill-btn"> add bill </Button>
      </div> 
      </>
      }
    {billsActive && <>
    
    {bills && bills.map((bill) =><>
   
    <div div className='bill'>
     <p>{bill.owner.name} paid <>{bill.total}</> zł for: </p>
     <div id={bill.id}>
       {/* <ul>{bill.completedItems.map((item) => <li>{item.text}</li>)}</ul>   */}
     </div> </div>
     <div className='divider' />
     </>)}
   
     <Button className= "settle-up-button" onClick={handleSettleUp}>SettleUp</Button>
    </>}
    </div>
  );
}

export default ShoppingList;
