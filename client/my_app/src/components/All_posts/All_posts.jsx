import React from 'react';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import './All_posts.css';

function All_posts({
  all_posts,
  set_all_posts,
  count,
  setCount,
  clicked_id,
  set_clicked_id,
}) {
  //let { all_posts, set_all_posts } = props;

  function buttonClick(e) {
    let temp_count;

    set_clicked_id(e.target.id);
    temp_count = count + 1;

    flushSync(() => {
      setCount(temp_count);
    });
  }

  useEffect(() => {
    fetch('http://localhost:4001/api/posts')
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        //console.log(521, json);

        set_all_posts([...json]);
      })
      .catch((error) => console.log(error));
    console.log(5000, count);
  }, [count]);

  return (
    <div>
      <div className='All_posts_1'>
        {all_posts[0] &&
          all_posts.map(
            (el, i) =>
              !el.isDeleted && (
                <ul className='ul1' id={i}>
                  <div>
                    {el.shortText} / {el.createdAt}
                  </div>
                  <div className='All_posts_button'>
                    <button
                      className='All_posts_button'
                      id={el._id}
                      onClick={buttonClick}
                    >
                      просмотр
                    </button>
                  </div>
                </ul>
              )
          )}
        <div></div>;
      </div>
    </div>
  );
}

export default All_posts;
