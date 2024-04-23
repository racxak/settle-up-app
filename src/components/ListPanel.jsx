import "./ListPanel.css"
import Line from "../assets/line.png"
export default function ListPanel({name,id, iOwn, owned }){
  return(<div className="list-panel-container"> 
  <span id="list-name-id">
  <h3>{name}</h3>
  <p id="id">#{id}</p> 
  </span>


  {iOwn.map(item => (
      <span id="horizontal-layout"> <div id="line"></div><p id="owe" key={item.name}> You owe {item.amount}zł to {item.name}  </p></span>
      ))}
      
      {owned.map(item => (
       <span id="horizontal-layout">  <div id="line"></div><p id="owes" key={item.name}> {item.name} owes you {item.amount}zł</p> </span>
      ))}
  
  </div>);
};