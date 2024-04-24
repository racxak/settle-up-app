import './ListsPage.css'
import IconButtonAdd from '../../assets/icon-button-add.png'
import { useRef,useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../Button';
import '../auth/Form.css';
import { GoPlus } from "react-icons/go";
import {LISTS} from "../../listy";
import ListPanel from '../ListPanel';

export default function ListsPage(){
const dialog = useRef();
const emailRef = useRef(null);
const listNameRef = useRef(null);

//testowe  
const [lists,setLists] = useState(LISTS);
const [listsEmpty,setListsEmpty] = useState(false);
const [members, setMembers] = useState("");

function handleDialogOpen (){
  dialog.current.open();
}

function handleDialogClose (){ 
  dialog.current.close();
}

const handleAddNewMember = () => {
  const email = emailRef.current.value;
  if (emailRef.current.checkValidity()) { 
    if(email){
    setMembers(prevMembers => [...prevMembers, email]); 
    emailRef.current.value = '';
    }
  }
};

const handleCreateList = (event) => {
  event.preventDefault();
  const listName = listNameRef.current.value.trim();
  if (listName && members.length !== 0) {
    const newList = {
      name: listName,
      members: members,
      id: Date.now(),  
      owned: [],
      i_own: []
    };
    setLists(prevLists => [...prevLists, newList]);
       emailRef.current.value = ''; 

    setMembers([]);  
    handleDialogClose();
  }
};

return(
<><div className="lists-page"> 
    <h1>SETTLEUP</h1>
    <div className='divider divider-position'> </div>
    <h2>LISTS</h2>
    {lists && <div id='scrollbar' className='lists-container'> 
      {lists.map((list)=><ListPanel index={list.id} name={list.name} id={list.id}  iOwn={list.i_own} owned={list.owned}> </ListPanel>)}
       </div>}

    {!lists && <div className='empty-info'><p> There's nothing here yet.</p> 
      <p>Add your first team and take control of your finances</p></div> }


    <button className='add-button button-icon' onClick={handleDialogOpen}>
      <img src={IconButtonAdd} alt="icon-button-add" />
    </button>
  </div>
  
  <Modal ref={dialog} onClose={handleDialogClose}>
  <h3 className='add-new-list-container-header'>Create a new list or join an existing one</h3>
  <form className='new-list'>
    <label>List name</label>
    <input type="text" ref={listNameRef} />
    <p>Add team member</p>
    <label>Email</label>
    <div className="input-with-button">
				<input className='input-with-btn' type="email" ref={emailRef}/>
				<span className='add-new-list-member'><GoPlus onClick= {handleAddNewMember}  className='add-new-list-member-btn'/></span>
			</div>
      <ul>
        {members && members.map((member, index) => (
          // TODO : wygląd i walidacja (komunikaty błedu)
          <li key={index}>{member}</li> 
        ))}
      </ul>

    <div className='divider-with-text'>
      <hr />
      <p className='divider-text'>or join an existing one</p>
      <hr />
    </div> 
    <label>List code</label>
    <input type="text" />
    <div className='buttons-container'>
    <Button>Join list</Button>
    <Button style={"filled"} onClick={handleCreateList}>Create list</Button>
    </div>
  </form>
</Modal> </>);
};