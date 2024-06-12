import React, { useState } from 'react';


const EmailDropdown = ({users, onUserSelect}) => {
  const [selectedEmail, setSelectedEmail] = useState('');
 
  const handleChange = (event) => {
    setSelectedEmail(event.target.value);

    const selectedUser = users.find(user => user.email === selectedEmail);
    console.log(selectedUser.id)

    if (selectedUser) {  
      onUserSelect(selectedUser.id);
    } 
};

  return (
    <div>
      <select id="email-select" value={selectedEmail} onChange={handleChange}>
        <option id="email-select-option" value="" disabled>Select user</option>
        {users.map(user => (
          <option key={user.id} value={user.email}> <p>{user.email}</p></option>
        ))}
      </select>
    </div>
  );
};

export default EmailDropdown;