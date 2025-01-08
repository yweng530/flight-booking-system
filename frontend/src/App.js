import './App.css';
import React, { useState, useEffect } from "react";
import Axios from 'axios';

function App() {
  const [UserID, setUserID] = useState(12345);
  const [UserName, setUserName] = useState("")
  const [Password, setPassword] = useState("");
  const [UserList, setUserList] = useState([]);
  const [newPassword, setNewPassword] = useState("");

  const [userIDSearch, setUserIDSearch] = useState();
  const [id, setID] = useState(12345);
  const [targetID, setTargetID] = useState('');
  const [targetName, setTargetName] = useState('');
  const [targetPassword, setTargetPassword] = useState('');
  let allUserID = [];

  Axios.get("http://localhost:3001/get").then((response) => {
    response.data.forEach(element => allUserID.push(element.UserID.toString()));
  });


  const submitUser = () => {
    if (allUserID.includes(UserID)) {
      alert('The UserId has exists!')
    }
    else {
      Axios.post("http://localhost:3001/insert", {
        "UserID": UserID,
        "UserName": UserName,
        "Password": Password
      }).then(() => {
        alert('Insert Success!')
      });
    }

    setUserList([
      ...UserList,
      {
        "UserID": UserID,
        "UserName": UserName,
        "Password": Password
      },
    ]);
  };

  const searchUser = (userID) => {
    if(!allUserID.includes(id)) {
      alert("Not find!");
    }
    else {
      setTargetID(id);
      setTargetName(UserName);
      setTargetPassword(Password);
      Axios.get("http://localhost:3001/search/${id}").then((response) => {
      alert("Search Success!");
      window.open(`http://localhost:3001/search/${id}`);
    });
    }
  }

  const deleteUser = (userID) => {
    setTargetID('');
    setTargetName('');
    setTargetPassword('');
    Axios.delete(`http://localhost:3001/delete/${userID}`).then((response) => {
      alert("Delete Success!");
    });
  }

  const updateUser = (userID, password) => {
    const prePassword = targetPassword;
    Axios.put("http://localhost:3001/update", {
      "userID": userID,
      "password": prePassword,
      "new_password": password,
    }).then((response) => {
      alert("Update Success!");
    });
    // setNewPassword("");
  };

  const advancedMinPrice = () => {
    Axios.get("http://localhost:3001/minPrice").then((response) => {
      alert("Query Success!")
      window.open(`http://localhost:3001/minPrice`);
    });
  }

  const advancedFlight = () => {
    Axios.get("http://localhost:3001/flight").then((response) => {
      alert("Query Success!");
      window.open(`http://localhost:3001/flight`);
    });
  }

  const storedProcedure = () => {
    Axios.get("http://localhost:3001/procedure").then((response) => {
      alert("Stored Procedure is ready");
      window.open(`http://localhost:3001/procedure`);
    });
  }

  return (
    <div className="App">
      <div className='header'>
        <h>Manage</h>
      </div>
      <div className="form">
        <h2>Insert</h2>
        <div className='form1'>
        <label>UserID:</label>
        <input type="number" name="UserID" onChange={(e) => {
          setUserID(e.target.value);
        }} />
        </div>

        <div className='form1'>
        <label>UserName:</label>
        <input type="text" name="UserName" onChange={(e) => {
          setUserName(e.target.value);
        }} />
        </div>
        
        <div className='form1'>
        <label>Password:</label>
        <input type="text" name="Password" onChange={(e) => {
          setPassword(e.target.value);
        }} />
        </div>

        <div className='form1'>
        <button onClick={submitUser}>Submit</button>
        </div>
      </div>

      <div className='search'>
        <h2>Search</h2>
        <label>userIDSearch</label>
        <input type="text" name="userIDSearch" onChange={(e) => {
          setUserIDSearch(userIDSearch);
          setID(e.target.value);
        }} />
        <button onClick={searchUser}>Search</button>
        <h3>{targetID===''?' ':'userID: ' + targetID}</h3>
            <p>{targetName===''?' ':'UserName: ' + targetName}</p >
            <p>{targetPassword===''?' ':'Password: ' + targetPassword}</p >
            <p><button onClick={() => {
          deleteUser(targetID);
        }}>Delete</button></p>
        <input type="text" id="updateUser" onChange={(e) => {
          setNewPassword(e.target.value)
        }} />
        <button onClick={() => {
          updateUser(targetID, newPassword);
        }}>Update</button>
      </div>
      
      <h2>advanced 1</h2>
      <button onClick={advancedMinPrice}>QueryOne</button>

      <h2>advanced 2</h2>
      <button onClick={advancedFlight}>QueryTwo</button>

      <h2>Procedure</h2>
      <button onClick={storedProcedure}>Procedure</button>
    </div>
  );
}

export default App;
