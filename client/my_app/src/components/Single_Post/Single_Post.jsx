import React from 'react';
import { useEffect, useState, useContext } from 'react';
import './Single_Post.css';
import email_context from '../../context/email_context';

import { flushSync } from 'react-dom';

function Single_Post({ clicked_id, set_clicked_id, count, setCount }) {
  let [src_, setSrc_] = useState([]);
  let [s, setS] = useState();
  let { i_email, set_i_email } = useContext(email_context);
  let s1;
  let temp_count;
  function handleClick() {
    console.log(503, s._id);
    fetch(`http://localhost:4001/api/posts/${s._id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        console.log(504);
        return res.json();
      })
      .then((json) => {
        console.log(501, json);
        temp_count = count + 1;

        flushSync(() => {
          setCount(temp_count);
        });
      })
      .catch((error) => console.log(error));

    console.log('click');
  }

  let file_name = [];
  useEffect(() => {
    fetch(`http://localhost:4001/api/posts/${clicked_id}`)
      .then((res) => {
        return res.json();
      })
      .then((single_post) => {
        console.log(899, single_post[0]);
        setS(single_post[0]);
        console.log(502, s);
        for (let i = 0; i < single_post[0]?.images.length; i++) {
          file_name.push(`/img/${single_post[0]?.images[i]?.filename}`);
        }

        setSrc_([...file_name]);
        console.log(902, src_);
      })
      .catch();
  }, [clicked_id, count]);

  if (s && s.isDeleted !== true) {
    return (
      <div className='Single_post_1'>
        <div>Текст объявления: {s?.shortText}</div>
        <div>Дата публикации: {s?.createdAt} </div>
        <div>Автор: {s?.userID} </div>
        {s?.i_email == i_email && (
          <button className='Single_post_button' onClick={handleClick}>
            удалить объявление
          </button>
        )}

        <div>
          {src_.map((el, i) => (
            <img
              src={src_[i]}
              alt='рисунки подтянутся позже'
              className='Single_Post_img'
            ></img>
          ))}
        </div>
      </div>
    );
  }
}

export default Single_Post;
