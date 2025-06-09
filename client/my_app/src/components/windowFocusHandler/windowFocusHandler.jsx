import React, { useEffect, useState } from 'react';

let i_email1;
let k = 0;
let time_now_focus;
let time_then_focus = 0;

const controller = new AbortController();
// User has switched back to the tab
const onFocus = () => {
  k++;
  time_now_focus = Date.now();
  console.log(
    'Tab is focus',
    i_email1,
    k,
    (time_now_focus - time_then_focus) / 1000
  );

  fetch(`http://localhost:4000/api/users/on/${i_email1}`, {
    signal: controller.signal,
    method: 'PATCH',
  })
    .then((res) => {
      console.log(504);
      return res.json();
    })
    .then((json) => {
      console.log(501, json);
    })
    .catch((error) => console.log(error));
  time_then_focus = time_now_focus;
};

// User has switched away from the tab (AKA tab is hidden)
let time_now_blur;
let time_then_blur = 0;
const onBlur = () => {
  time_now_blur = Date.now();

  console.log(
    'Tab is blurred',
    i_email1,
    (time_now_blur - time_then_blur) / 1000
  );

  time_then_blur = time_now_blur;
};

function WindowFocusHandler({ i_email }) {
  i_email1 = i_email;
  useEffect(() => {
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      controller.abort();
    };
  }, []);

  return <></>;
}

export default WindowFocusHandler;
