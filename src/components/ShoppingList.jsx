import React, {useState } from 'react';
import AddIcon from "./../assets/icon-button-add.png"
import Button from "./Button"
import "./ShoppingList.css"
import { API } from '../listy';
import { GoX } from "react-icons/go";
function ShoppingList({initialItems, getItems, listId}) {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [bills, setBills] = useState([]);

  const [billsActive, setBillsActive] = useState (false); 
  const [costs, setCosts] = useState('');


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

  const toggleItemCompletion = (id) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };


  const handleAddBill = () => {
    if (costs && items.some(item => item.completed)) {
      const completedItems = items.filter(item => item.completed);
      const newBill = {
        id: Date.now(),
        completedItems: completedItems,
        // personId: ;
        costs: costs
      };
      setBills(prevBills => [...prevBills, newBill]);
      setItems(prevItems => prevItems.filter(item => !item.completed));
      setCosts('');
    }
  };
  const handleToggleView = () => {
    setBillsActive(prev => !prev);
  };


  const handleSettleUp = () => {
    setBills("");
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
      <img onClick={handleAddItem}src={AddIcon} alt="icon-add-btn" />
      </form>
    </div>

      <ul id='shopping-list'>
        {initialItems && initialItems.map(item => (
          <li className="list-item"  key={item.id}>
            <input
              id = "cb"
              type="checkbox"
              checked={item.completed}
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
     <p>*UserName* paid <>{bill.costs}</> zł for: </p>
     <div id={bill.id}> <ul>{bill.completedItems.map((item) => <li>{item.text}</li>)}</ul>  
     </div> </div>
     <div className='divider' />
     </>)}
  
     <Button className= "settle-up-button" onClick={handleSettleUp}>SettleUp</Button>
    </>}
    </div>
  );
}

export default ShoppingList;
