import React from 'react';
import './Login.css';
import { useState, useContext } from 'react';
import email_context from '../context/email_context';

function Login() {
  let { i_email, set_i_email } = useContext(email_context);
  let [login_status, set_login_status] = useState();
  let em;
  function handleSubmit(e) {
    e.preventDefault();

    em = e.target.email.value;
    fetch(`http://127.0.0.1:4000/api/users/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        set_i_email(json[0].email);

        if (json[0]._id) {
          set_login_status(`Вы вошли по email ${em} `);
          sessionStorage.setItem('i_email_ses_store', em);

          window.location.reload();
        }
        console.log('куки', document.cookie);
      })
      .catch((error) => {
        console.log(1900, error);
        if (error)
          set_login_status('Вы не вошли, возможно ошибка в email или пароле');
      });

    e.target.email.value = '';
    e.target.password.value = '';
  }

  return (
    <div className='Login_flex'>
      <form action='' onSubmit={handleSubmit} className='Login_form'>
        <h1>Форма ввода</h1>
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

          <br />
          <button className='Login_button' type='submit'>
            Вход
          </button>
        </div>
      </form>
      <div>{login_status}</div>
    </div>
  );
}
export default Login;
