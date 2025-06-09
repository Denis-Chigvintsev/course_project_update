import React from 'react';
import './Signup.css';
import { useState } from 'react';

function Signup() {
  let [message, SetMessage] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.email.value, e.target.password.value);

    fetch('http://localhost:4000/api/users/signup', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
        nick: e.target.nick.value,
      }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json == 'failure') {
          SetMessage(
            'Регистрация не прошла, возможно что уже есть такой пользователь'
          );
        } else {
          SetMessage('успошная регистрация');
        }
        const i_user = json.email;
        console.log(i_user);
      })
      .catch((error) => {
        console.log(error);
      });
    e.target.email.value = '';
    e.target.password.value = '';
  }

  return (
    <div className='Signup_flex'>
      <form action='' onSubmit={handleSubmit} className='Login_form'>
        <h1>Форма регистарции</h1>
        <div className='Login_inner_form'>
          <label htmlFor='' className='Loging_lable'>
            Email:
            <input className='Login_input' type='text' name='email' />
          </label>
          <div className='Login_empty_line'></div>
          <label htmlFor='' className='Loging_lable'>
            Password:
            <input className='Login_input2' type='text' name='password' />
          </label>
          <label htmlFor='' className='Loging_lable'>
            Nick:
            <input className='Login_input3' type='text' name='nick' />
          </label>
          <br />
          <button className='Login_button' type='submit'>
            Зарегистрироваться
          </button>
        </div>
      </form>
      <div>{message}</div>
    </div>
  );
}
export default Signup;
