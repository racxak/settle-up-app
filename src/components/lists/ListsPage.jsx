import './ListsPage.css'
import IconButtonAdd from '../../assets/icon-button-add.png'
import { useState } from 'react';

export default function ListsPage(){

//testowe  
const [listsEmpty,setListsEmpty] = useState(false);

return(<div className="lists-page"> 
    <h1>SETTLEUP</h1>
    <div className='divider divider-position'> </div>
    <h2>LISTS</h2>
    {listsEmpty && <div className='lists-container'>
      
      
      </div>}

    {!listsEmpty && <div className='empty-info'><p> There's nothing here yet.</p> 
<p>Add your first team and take control of your finances</p></div> }



    <button className='add-button button-icon'>
      <img src={IconButtonAdd} alt="icon-button-add" />
    </button>
  </div>);
};