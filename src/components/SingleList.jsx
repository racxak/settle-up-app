import { useLocation } from 'react-router-dom';
import "./SingleList.css"
export default function SingleList(){
  const location = useLocation();
  const { name, id, iOwn, owned } = location.state; 


  
return(
  <div className="single-list-page"> 
     <div id="page-header">
     <h1>SETTLEUP</h1>
      <div className='divider'> </div>
      <span id='horizontal-layout' className='placement'><h2 id="list-name">{name} </h2><h2 id="list-id">#{id}</h2></span>
      </div>
      <div id="debts">
      {iOwn.map(item => (
      <span id="horizontal-layout"> <div id="line"></div><p id="owe" key={item.name}> You owe {item.amount}zł to {item.name}  </p></span>
      ))}
      
      {owned.map(item => (
       <span id="horizontal-layout">  <div id="line"></div><p id="owes" key={item.name}> {item.name} owes you {item.amount}zł</p> </span>
      ))}
      </div>
    </div>
  );
  };
  // return (
  //     <div>
  //         <h1>{name}</h1>
  //         <ul>
  //             {iOwn.map((item, index) => (
  //                 <li key={index}>You owe {item.amount} zł to {item.name}</li>
  //             ))}
  //             {owned.map((item, index) => (
  //                 <li key={index}>{item.name} owes you {item.amount} zł</li>
  //             ))}
  //         </ul>
  //     </div>
  // );
