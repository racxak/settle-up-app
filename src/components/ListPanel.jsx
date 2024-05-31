import "./ListPanel.css"
import { useNavigate } from "react-router-dom";

export default function ListPanel({name, listId, userBalance}){
	const navigate = useNavigate();


  return(
   <div onClick={() =>  navigate(`/list/${listId}`)}
  className="list-panel-container"> 
  <span id="list-name-id">
  <h3>{name}</h3>
  <p id="id">#{listId}</p> 
  </span>
  <span id="horizontal-layout"> <div id="line"></div><p id="owe"> Balance {userBalance}zł </p></span>



{/*  Wyświetlanie pod konkretne rozliczenia
      
      {iOwn.map(item => (
      <span id="horizontal-layout"> <div id="line"></div><p id="owe" key={item.name}> You owe {item.amount}zł to {item.name}  </p></span>
      ))}
      
      {owned.map(item => (
       <span id="horizontal-layout">  <div id="line"></div><p id="owes" key={item.name}> {item.name} owes you {item.amount}zł</p> </span>
      ))} */}
  
  </div>);
};