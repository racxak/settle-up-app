import './ListsPage.css'
import IconButtonAdd from '../../assets/icon-button-add.png'
import { useRef,useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../Button';
import '../Form.css';

export default function ListsPage(){
const dialog = useRef();

//testowe  
const [listsEmpty,setListsEmpty] = useState(false);

function handleDialogOpen (){
  dialog.current.open();
}

function handleDialogClose (){ 
}

return(
<><div className="lists-page"> 
    <h1>SETTLEUP</h1>
    <div className='divider divider-position'> </div>
    <h2>LISTS</h2>
    {listsEmpty && <div className='lists-container'>
      </div>}

    {!listsEmpty && <div className='empty-info'><p> There's nothing here yet.</p> 
      <p>Add your first team and take control of your finances</p></div> }

    <button className='add-button button-icon' onClick={handleDialogOpen}>
      <img src={IconButtonAdd} alt="icon-button-add" />
    </button>
  </div>
  
  <Modal ref={dialog} onClose={handleDialogClose}>
  <h3 className='add-new-list-container-header'>Create a new list or join an existing one</h3>
  <form className='new-list'>
    <label>Team name</label>
    <input type="text" />
    <p>Add team member</p>
    <label>Email</label>
    <input type="text" />

    <div className='divider-with-text'>
      <hr />
      <p className='divider-text'>or join an existing one</p>
      <hr />
    </div> 
    <label>Team code</label>
    <input type="text" />
    <div className='buttons-container'>
    <Button>Join Team</Button>
    <Button style={"filled"}>Create Team</Button>
    </div>
  </form>
</Modal> </>);
};