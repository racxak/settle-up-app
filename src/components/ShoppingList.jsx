import React, { useState } from 'react';
import AddIcon from "./../assets/icon-button-add.png"
import Button from "./Button"
import "./ShoppingList.css"
import {LISTS} from "../listy"
function ShoppingList({initialItems}) {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const newItemObject = {
        id: Date.now(), 
        text: newItem,
        completed: false 
      };
      setItems(prevItems => [...prevItems, newItemObject]);
      setNewItem(''); 
    }
  };

  const toggleItemCompletion = (id) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };


  return (
    <div id='shopping-list-container'>
      <div>
      <input
        type="text"
        value={newItem}
        onChange={e => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
     <img onClick={handleAddItem}src={AddIcon} alt="icon-add-btn" /></div>
      <ul id='shopping-list'>
        {items.map(item => (
          <li key={item.id}>
            {/* todo: ładniejsze checkboxy */}
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItemCompletion(item.id)}
            />
            {item.text}
          </li>
        ))}
      </ul>
 
      <div id='horizontal-layout' className='add-bill-container'>
        <input id="i-paid" type="text" placeholder='$$$' />
        <Button className="add-bill-btn"> add bill </Button>
      </div>
    </div>
  );
}

export default ShoppingList;
