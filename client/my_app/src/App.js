import React from 'react';

import { useState, useContext, useEffect } from 'react';
import email_context from './context/email_context';
import { flushSync } from 'react-dom';
import './App.css';
import Socket from './components/Socket/Socket';

import Login from './components/Login';
import Signup from './components/Signup/Signup';
import User_profile from './components/User_profile/User_profile';
import AddPost from './components/AddPost/AddPost';
import All_posts from './components/All_posts/All_posts';
import Single_Post from './components/Single_Post/Single_Post';

import { render } from '@testing-library/react';

function App() {
  let [i_email, set_i_email] = useState(
    sessionStorage.getItem('i_email_ses_store')
  );
  let [all_posts, set_all_posts] = useState([]);

  let [count, setCount] = useState(0);
  let [clicked_id, set_clicked_id] = useState();

  let [sc, setSc] = useState(0);
  let [users_online1, setUsersOnline1] = useState(null);

  return (
    <email_context.Provider value={{ i_email, set_i_email }}>
      <div className='App'>
        <Login />
        <Signup />
        <User_profile />
        <AddPost count={count} setCount={setCount} />
        <div className='App_AddPost_placement'>
          <All_posts
            all_posts={all_posts}
            set_all_posts={set_all_posts}
            count={count}
            setCount={setCount}
            clicked_id={clicked_id}
            set_clicked_id={set_clicked_id}
          />
        </div>
        <div className='App_Single_post_placement'>
          <Single_Post
            clicked_id={clicked_id}
            set_clicked_id={set_clicked_id}
            count={count}
            setCount={setCount}
          />
        </div>
        <div>
          <Socket sc={sc} setSc={setSc} count={count} setCount={setCount} />
        </div>
      </div>
    </email_context.Provider>
  );
}

export default App;
