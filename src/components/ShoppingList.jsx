import React, { useRef, useState } from 'react';
import AddIcon from "./../assets/icon-button-add.png"
import Button from "./Button"
import "./ShoppingList.css"
import {LISTS} from "../listy"
function ShoppingList({initialItems}) {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const [bills, setBills] = useState([]);

  const [billsActive, setBillsActive] = useState (false); 
  const [costs, setCosts] = useState('');
  const handleAddItem = () => {
    if (newItem.trim() !== '' && newItemAmount.trim() !== '') {
      const newItemObject = {
        id: Date.now(), 
        text: newItem,
        completed: false,
        amount: newItemAmount, 
      };
      setItems(prevItems => [...prevItems, newItemObject]);
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
        {items.map(item => (
          <li className="list-item" key={item.id}>
            <input
              id = "cb"
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItemCompletion(item.id)}
            />
            <span className='item-amount'>
            <p>{item.text}</p>
            <p>{item.amount}</p>
            </span>
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
