import React from 'react';
import './User_profile.css';
import { useState } from 'react';
import { useContext } from 'react';
import email_context from '../../context/email_context';

function User_profile() {
  let [flag1, setFlag1] = useState(0);
  let { i_email, set_i_email } = useContext(email_context);
  let [i_user, set_i_user] = useState({});
  function handleClick(e) {
    e.preventDefault();
    setFlag1(1);

    fetch(`http://localhost:4000/api/users/search/${i_email}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json[0]);
        set_i_user(json[0]);
        console.log(561, i_user.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className='User_profile_flex'>
      <div className='User_profile_gen'>
        <h1>Ваш профиль:</h1>
        <br />
        <button className='User_profile_button' onClick={handleClick}>
          Вывести Ваш профиль
        </button>
        <br />
      </div>
      {i_email && flag1 == 1 && (
        <div>
          <div>Email: {i_user?.email}</div>
          <div>id: {i_user?._id} </div>
          <div>Nickname: {i_user?.nick} </div>
        </div>
      )}
    </div>
  );
}
export default User_profile;
