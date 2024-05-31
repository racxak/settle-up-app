import { useLocation, useParams } from 'react-router-dom';
import IconButtonAdd from "../assets/icon-button-add.png"
import IconEvents from "../assets/icon-events.png"
import IconUsers from "../assets/icon-users.png"

import "./SingleList.css"
import { useContext, useEffect, useState } from 'react';
import ShoppingList from './ShoppingList';
import Navbar from './navbar/Navbar';
import { API } from '../listy';
import { AuthContext } from '../contexts/authContext';

export default function SingleList(){
  const { listId } = useParams();
  
  const {token} = useContext(AuthContext);
  const location = useLocation();
  const [eventsActive, setEventsActive] = useState('users');
  const [debtsShown, setDebstShown] = useState(true);
  const [listData, setListData]=useState([]);
  const [items, setItems] = useState([]); 
  useEffect(()=>{
    if (token){
    fetchShoppingList() 
    fetchShoppingListItems() }
  }, [token])


  function handleDeptsShown(){
    setDebstShown(prev => !prev);
  }

  const fetchShoppingList = async () => {
    const url = `${API}/shopping-lists/${listId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setListData(data);
      } else {
        console.error('Failed to fetch shopping lists');
      }
    } catch (error) {
      console.error('An unexpected error occurred while fetching shopping lists');
    }
  };
  
  const fetchShoppingListItems = async () => {
    const url = `${API}/shopping-lists/${listId}/items`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const items = await response.json();
        setItems(items.page);
      } else {
        console.error('Failed to fetch shopping list items');
      }
    } catch (error) {
      console.error('An unexpected error occurred while fetching shopping list items');
    }
  };
  
return(
  <div id="scrollbar"className="single-list-page"> 
     <Navbar >
      <span onClick ={handleDeptsShown} id='horizontal-layout' className='placement'> <h2 id="list-name"> {listData.name} </h2><h2 id="list-id">#{listId}</h2></span>
      </Navbar>

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

      {/* <ShoppingList initialItems={items}></ShoppingList> */}
    

      {/* <div id='right-container'>
        <div id="horizontal-layout" >
          <img onClick={()=>setEventsActive('events')} id="icon-events" src={IconEvents} alt="icon-events" />
          <img onClick={()=>setEventsActive('users')} id="icon-users" src={IconUsers} alt="icon-users" />
        </div>
        {eventsActive ==='users' && <div className='users-or-events-container users-list'>
          {listMembers.map(member => <><p> {member}</p><hr/></>
          )}
        </div> }
        {eventsActive==="events" && <div className='users-or-events-container events-lists'>
         {/* TODO : events */} 
         {/* <p>event</p>
         <hr />
         <p>event</p>
        </div> }
        
      </div> */}
      
      <ShoppingList initialItems={items} getItems={fetchShoppingListItems} listId ={listId}> </ShoppingList> 

    </div>
  );
  };
