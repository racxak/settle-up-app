import { useLocation } from 'react-router-dom';
import IconButtonAdd from "../assets/icon-button-add.png"
import IconEvents from "../assets/icon-events.png"
import IconUsers from "../assets/icon-users.png"

import "./SingleList.css"
import { useState } from 'react';
import ShoppingList from './ShoppingList';
import Navbar from './navbar/Navbar';
export default function SingleList(){
  const location = useLocation();
  const {name, id, iOwn, owned, listMembers, items} = location.state; 
  const [eventsActive, setEventsActive] = useState('users');
  const [depstShown, setDepstShown] = useState(true);


  function handleDeptsShown(){
    setDepstShown(prev => !prev);
  }
  
return(
  <div id="scrollbar"className="single-list-page"> 
     <Navbar >
      <span onClick ={handleDeptsShown} id='horizontal-layout' className='placement'> <h2 id="list-name">{name} </h2><h2 id="list-id">#{id}</h2></span>
      </Navbar>

      {depstShown &&
      <div id="debts">
      {iOwn.map(item => (
      <span id="horizontal-layout"> <div id="line"></div><p id="owe" key={item.name}> You owe {item.amount}zł to {item.name}  </p></span>
      ))}
      
      {owned.map(item => (
       <span id="horizontal-layout">  <div id="line"></div><p id="owes" key={item.name}> {item.name} owes you {item.amount}zł</p> </span>
      ))}
      </div>
}

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
      
      <ShoppingList initialItems={items}></ShoppingList>

    </div>
  );
  };
