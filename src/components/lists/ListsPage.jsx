import './ListsPage.css'
import IconButtonAdd from '../../assets/icon-button-add.png'
import { useRef, useState, useContext, useEffect } from 'react';
import Modal from '../modal/Modal';
import Button from '../Button';
import '../auth/Form.css';
import { GoPlus } from "react-icons/go";
import {LISTS} from "../../listy";
import ListPanel from '../ListPanel';
import Navbar from '../navbar/Navbar';
import { AuthContext } from '../../contexts/authContext';
import {API} from "../../listy"
export default function ListsPage(){
const dialog = useRef();
const emailRef = useRef(null);
const listNameRef = useRef(null);

//testowe  
const [lists,setLists] = useState();
const [members, setMembers] = useState([]);
const { token, userId } = useContext(AuthContext);
const [errorMsg, setErrorMsg] = useState("");
const [email, setEmail] = useState(""); 


function handleDialogOpen (){
  dialog.current.open();
}

useEffect(() => {
  if (token && userId) {
    fetchShoppingLists();
  }
}, [token, userId]);

const fetchShoppingLists = async () => {
  const url = `${API}/shopping-lists?userId=${userId}&offset=0&limit=1000`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setLists(data.page);
      console.log(data);
    } else {
      console.error('Failed to fetch shopping lists');
    }
  } catch (error) {
    console.error('An unexpected error occurred while fetching shopping lists');
  }
};


function handleDialogClose (){ 
  dialog.current.close();
}

const handleAddNewMember = () => {
  const email = emailRef.current.value;
  if (emailRef.current.checkValidity()) { 
    if(email){
    setMembers(prevMembers => [...prevMembers, email]); 
    emailRef.current.value = "";
    }
  }
};

const handleCreateList = async (e) => {
  e.preventDefault();
  const listName = listNameRef.current.value.trim();
  if (listName && members.length !== 0 ) {
    const newList = {
      name: listName,
      ownerId: userId,
      members: members
    };
		const url = API + `/shopping-lists?userId=${userId}`;
    try {
			const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newList)
      });

      if (response.ok) {
        fetchShoppingLists();
        const data = await response.json();
        console.log(data)
        setErrorMsg("");
      } else if(response.status!==201) {
			setErrorMsg(response.message);}
    } catch (error) {
      setErrorMsg('An unexpected error occurred');
    }

    setMembers([]);  
    handleDialogClose();
  }
};

return(
<><div id="scrollbar" className="lists-page"> 
    <Navbar>
    <h2 className='lists'>LISTS</h2>
    </Navbar>
    
    {lists && <div id='scrollbar' className='lists-container'> 
      {lists.map((list)=><ListPanel key={list.id} name={list.name} id={list.id}  owner={list.owner} userBalance={list.userBalance}>
        </ListPanel>)}
       </div>}

    {!lists && <div className='empty-info'><p> There's nothing here yet.</p> 
      <p>Add your first team and take control of your finances.</p></div> }


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