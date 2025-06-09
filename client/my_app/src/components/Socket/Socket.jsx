import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useContext } from 'react';

import email_context from '../../context/email_context';

import './Socket.css';

import WindowFocusHandler from '../windowFocusHandler/windowFocusHandler';

import { v4 as uuidv4 } from 'uuid';
let inViewport = require('in-viewport');

let m_array = [];

let temp_mes;
let flag_1 = 0;
let nick1;
let now = 0;
let last_Click_Time = 0;
let start_chat_flag = 0;
let users_array;
let this_time;
let last_time;
let valid_sockets;
let valid_socket_id;
let message_i_email1;
let message_i_email2;
let div_id_1;
let span_id_1;
let div_id_2;
let span_id_2;
let spans_ = [];

function Socket({ sc, setSc, count, setCount }) {
  let { i_email, set_i_email } = useContext(email_context);
  let [socket_id, set_Socket_id] = useState('');
  let [users_online_st, setUsersOnline_st] = useState(null);
  let [users_online1, setUsersOnline1] = useState(null);
  let [nick_butt, setNick_butt] = useState('');
  let [mes_id, set_mes_id] = useState('');
  let [usersAll, setusersAll] = useState(null);
  let [real_rooms_online, set_real_rooms_online] = useState(null);
  let [message_id_read, set_message_id_read] = useState(null);
  let [spans0, set_spans0] = useState([]);
  const [socket, setSocket] = useState(
    io('ws://localhost:4002', {
      reconnection: true,
      autoConnect: true,
      transports: ['websocket'],
    })
  );

  let [m_array_private, set_m_array_private] = useState([]);
  let [m_array_private_selected, set_m_array_private_selected] = useState([]);

  let [real_room_selected, set_real_room_selected] = useState('');

  let [m_array_room, set_m_array_room] = useState([]);
  let [m_array_room_selected, set_m_array_room_selected] = useState([]);
  let [room_mess_state, set_room_mess_state] = useState(null);

  let div;
  let span;
  let div1;
  let span1;
  let div2;
  let span2;
  //let [online, setOnline] = useState(true);

  function handle_Create_Room(e) {
    e.preventDefault();
    console.log('click', e.target.room_name.value);

    socket.emit('create_room', {
      real_room_name: e.target.room_name.value,
      i_email: i_email,
      nick: nick1,
    });
    e.target.room_name.value = '';
  }
  function nickClick(e) {
    setTimeout(() => {
      console.log(422, nick1, i_email, e.target.id);
      fetch(
        `http://localhost:4001/api/posts/private_chat/${i_email}/${nick1}/${e.target.id}`
      )
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          set_m_array_private_selected((prev) => [...json]);
          console.log(5222, m_array_private_selected);
        })
        .catch((error) => console.log(error));
      //setSc((prev) => prev + 1);
      //setCount((prev) => prev + 1);
    }, 2000);
    ////////
    setNick_butt(e.target.id);
  }
  function roomClick(e) {
    console.log('click', e.target.id);
    setTimeout(() => {
      console.log(422, nick1, i_email, e.target.id);
      fetch(
        `http://localhost:4001/api/posts/real_room_chat/${i_email}/${nick1}/${e.target.id}`
      )
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          set_m_array_room_selected((prev) => [...json]);
          console.log(5222, json, m_array_room_selected);

          socket.emit('join-room', e.target.id);
        })
        .catch((error) => console.log(error));
      //setSc((prev) => prev + 1);
      //setCount((prev) => prev + 1);
    }, 2000);

    set_real_room_selected(e.target.id);
  }

  function room_message_submit(e) {
    e.preventDefault();
    console.log(e.target.room_message.value);
    let message = e.target.room_message.value;
    if (e.target.room_message.value !== '') {
      socket.emit(
        'real_room_message',
        { message },
        real_room_selected,
        nick1,
        i_email
      );
      e.target.room_message.value = '';
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    now = Date.now();
    if (now - last_Click_Time > 1000 || start_chat_flag == 0) {
      start_chat_flag = 1;
      ///здесь просто хочу чтоб по 2 сообщения не вылетали из за залипания клавиши

      ///здесь мы  получаем ник ((
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
          nick1 = json[0].nick;

          let message = e.target.message.value;

          console.log(799, message);
          e.target.message.value = '';

          // socket.connected[valid_socket_id].emit('createPublic', { message });
          socket.emit('createPublic', { message }, nick1, i_email);

          setSc((prev) => prev + 1);
          setCount((prev) => prev + 1);
        })

        .catch((error) => {
          console.log(1000000000000, error);
        });
      last_Click_Time = now;
    }
  }

  function handleSubmit_private(e) {
    e.preventDefault();

    now = Date.now();
    if (now - last_Click_Time > 1000 || start_chat_flag == 0) {
      start_chat_flag = 1;
      ///здесь просто хочу чтоб по 2 сообщения не вылетали из за залипания клавиши

      console.log('click');
      ///здесь мы  получаем свой ник ((
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
          nick1 = json[0].nick;

          //let message = nick1 + ': ' + e.target.message.value;
          let message = e.target.message.value;

          setTimeout(() => {}, 0);
          let idx = users_online1.findIndex((el) => el.nick == nick_butt);
          let socket_receiver_id;
          let socket_receiver_nick;
          setTimeout(() => {
            socket_receiver_id = users_online1[idx]?.socket_id_;
            socket_receiver_nick = users_online1[idx]?.nick;
            //socket_receiver_nick=nick_butt; здесь можно ник взять не из базы
            console.log(1000500, idx, users_online1);
            e.target.message.value = '';
            // e.target.receiver_socket_id.value = '';
            socket.emit(
              'createMessage',
              { message },
              socket_receiver_id,
              socket_id,
              socket_receiver_nick,
              nick1,
              i_email
            );
            //setSc((prev) => prev + 1);
            //setCount((prev) => prev + 1);
          }, 100);
        })
        .catch((error) => {
          console.log(error);
        });
      last_Click_Time = now;
    }
  }

  //////////////////////////////////////////////////
  /*
  useEffect(() => {
    const controller = new AbortController();

    if (isOnline == true) {
      fetch(`http://localhost:4000/api/users/on/${i_email}`, {
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
    }
    if (isOnline == false) {
      fetch(`http://localhost:4000/api/users/off/${i_email}`, {
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
    }
    return () => controller.abort();
  }, [isOnline]);

  */
  /*
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
      fetch('http://localhost:4000/api/users/online')
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          users_array = [...json];

          console.log(198, users_array[0]);
        })
        .catch((error) => console.log(error));
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);
*/

  ///////////////////////
  useEffect(() => {
    fetch('http://localhost:4001/api/posts/chat')
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(521, json);
        m_array = [...json];
      })
      .catch((error) => console.log(error));
    //setSc((prev) => prev + 1);
    //setCount((prev) => prev + 1);
  }, []);
  ///
  useEffect(() => {
    console.log(5210);
    fetch('http://localhost:4001/api/posts/get_room_list')
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(5211, json);
        let temp_array = [];
        json.forEach((el) => temp_array.push(el.real_room_name));

        setTimeout(() => {
          set_real_rooms_online((prev) => [...temp_array]);
        }, 1000);
      })
      .catch((error) => console.log(error));
  }, []);

  ////

  useEffect(() => {
    setTimeout(() => {
      console.log(422, nick1);
      fetch(`http://localhost:4001/api/posts/private_chat/${i_email}/${nick1}`)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          set_m_array_private((prev) => [...json]);
          set_m_array_private_selected((prev) => [...json]);

          console.log(522, m_array_private);
        })
        .catch((error) => console.log(error));
      //setSc((prev) => prev + 1);
      //setCount((prev) => prev + 1);
    }, 2000);
  }, []);

  ////

  ////

  useEffect(() => {
    const socket1 = io('ws://localhost:4002', {
      reconnection: true,
      autoConnect: true,
      transports: ['websocket'],
    });
    setSocket(socket1);
    return () => socket1.close();
  }, []);

  if (i_email) {
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
        nick1 = json[0].nick;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const controller = new AbortController();
    socket.on(
      'connect',
      () => {
        console.log(`сокет на клиенте подключен id ${socket.id}`);
        socket.emit('user_connected', {
          socket_id: socket.id,
          i_email: i_email,
        });
        set_Socket_id(socket.id);
        setTimeout(() => {
          fetch(`http://localhost:4000/api/users/on/${i_email}/${socket.id}`, {
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
        });
      },
      500
    );

    socket.on('users_online', (json1, users_online_11) => {
      valid_sockets = [...users_online_11];
      //console.log(-9001, json1, valid_sockets);
      let valid_index = valid_sockets.findIndex(
        (el) => el?.i_data.i_email == i_email
      );
      valid_socket_id = valid_sockets[valid_index]?.i_data.socket_id;
      //console.log(899, valid_socket_id);

      setUsersOnline1((prev) => [...json1]);
      setUsersOnline_st((prev) => [...json1].length);
      setTimeout(() => {
        //console.log(9001, json1, users_online1, users_online_st);
        //setSc((prev) => prev + 1);
        //setCount((prev) => prev + 1);
      }, 15000);
    });

    socket.on('real_rooms_online', (array) => {
      console.log(1555, array);
      set_real_rooms_online((prev) => [...array]);
    });

    if (i_email) {
      socket.on('newMessage', (message) => {
        this_time = message.date;
        if (this_time !== last_time) {
          span = document.createElement('span');
          div = document.createElement('div');
          console.log(9000, message.id);
          if (message.i_email == i_email) {
            message_i_email1 = message.i_email;
            span.textContent = `Вы:   ${message.text} / ${message.date}`;
            span.classList.add('Socket_li_mine_1');
            span.setAttribute('sending_nick', message.nick);
            span.setAttribute('date', message.date);
            span.id = message.id;
            div.classList.add('Socket_li_mine_div_1');
            div.id = uuidv4();
            div_id_1 = div.id;
            console.log('Ура1');
          } else {
            span.textContent = `${message.nick}: ${message.text} / ${message.date}`;
            span.classList.add('Socket_li_1');
            span.setAttribute('sending_nick', message.nick);
            span.setAttribute('date', message.date);
            span.id = message.id;

            div.classList.add('Socket_li_div_1');
            div.id = uuidv4();
            div_id_1 = div.id;
            console.log('Ура2');
          }

          setTimeout(() => {
            set_mes_id(message.id);
          }, 1000);
          //span.setAttribute('id', message.id);

          span.addEventListener('mouseover', (e) => {
            console.log(
              `${e.target.getAttribute('sending_nick')}, ${e.target.id}`
            );

            if (e.target.getAttribute('sending_nick') !== nick1) {
              console.log(span.getAttribute('sending_nick'));
              console.log(nick1);
              socket.emit(
                'read_conf',
                nick1,
                e.target.getAttribute('sending_nick'),
                e.target.textContent,
                e.target.id
              );
            }
          });

          socket.on(
            'read_conf1',
            (reader_nick, sender_nick, message_text, span_id) => {
              console.log(
                ` reader nick ${reader_nick}, sender nick ${sender_nick}, message: ${message_text}`
              );
              let span0 = document.getElementById(`${span_id}`);
              console.log('span0', span0.textContent);
              console.log(nick1, sender_nick);
              if (nick1 == sender_nick && span_id == span0.id) {
                console.log(nick1, sender_nick);
                //  span0.textContent = `${span0.textContent} + \n  ${reader_nick}`;
                span0.classList.add('Socket_span0_read');
                spans_.push(span0.textContent);

                console.log(new Date());
                setTimeout(() => {
                  set_spans0((prev) => [...spans_]);
                }, 1000);
              }
            }
          );

          ///////
          /*
          inViewport(span, visible);

          function visible(span) {
            // elt === elem
            console.log(span.id + ' is visible in the window!');
            console.log(span.getAttribute('sending_nick'));
            console.log(nick1);
            if (span.getAttribute('sending_nick') !== nick1) {
              console.log(span.getAttribute('sending_nick'));
              console.log(nick1);
              socket.emit(
                'read_conf',
                nick1,
                span.getAttribute('sending_nick'),
                span.textContent,
                span.id
              );
            }

            //nick1- это у кого на компе это высветилось, span.getAttribute('sending_nick') -это тот кто отправил сообщение
            
          }
*/
          ///////

          if (span && div && i_email == message_i_email1) {
            setTimeout(() => {
              document.querySelector('.Socket_root1')?.appendChild(div);
              document.getElementById(div_id_1)?.appendChild(span);
            }, 1000);
          }
          if (span && div && i_email !== message_i_email1) {
            setTimeout(() => {
              document.querySelector('.Socket_root1')?.appendChild(div);
              document.getElementById(div_id_1)?.appendChild(span);
            }, 1000);
          }
        }
        last_time = this_time;
        return () => {
          controller.abort();
          socket.off('newMessage').off();
        };
      });
    }
    ////ниже у нас идет вывод сообщений newPrivate
    if (i_email) {
      socket.on('newPrivate', (message) => {
        span1 = document.createElement('span');
        div1 = document.createElement('div');
        console.log(18, i_email, message.sender_i_email);
        if (i_email == message.sender_i_email) {
          message_i_email2 = message.sender_i_email;
          span1.textContent = `Вы:  ${message.text} / ${message.date}`;
          span1.classList.add('Socket_li_mine_2');
          div1.classList.add('Socket_li_mine_div_2');
          span1.setAttribute('sending_nick', message.sender_nick);
          span1.setAttribute('date', message.date);

          div1.id = uuidv4();
          div_id_2 = div1.id;
        } else {
          span1.textContent = `${message.sender_nick}: ${message.text} / ${message.date}`;
          span1.classList.add('Socket_li_2');
          div1.classList.add('Socket_li_div_2');
          span1.setAttribute('sending_nick', message.sender_nick);
          span1.setAttribute('date', message.date);
          div1.id = uuidv4();
          div_id_2 = div1.id;
        }

        setTimeout(() => {
          set_mes_id(message.id);
        }, 1000);
        span1.setAttribute('id', message.id);
        console.log(5090, span1.id);

        span1.addEventListener('mouseover', (e) => {
          console.log(
            `${e.target.getAttribute('sending_nick')}, ${e.target.id}`
          );

          if (e.target.getAttribute('sending_nick') !== nick1) {
            console.log(e.target.getAttribute('sending_nick'));
            console.log(nick1);
            socket.emit(
              'read_conf_private',
              nick1,
              e.target.getAttribute('sending_nick'),
              e.target.textContent,
              e.target.id,
              socket.id
            );
          }
        });

        socket.on('read_conf_private1', (reader_nick, sender_nick, span_id) => {
          console.log(
            ` reader nick ${reader_nick}, sender nick ${sender_nick}`
          );
          let span10 = document.getElementById(`${span_id}`);
          console.log('span10', span10.textContent);
          console.log(700, nick1, sender_nick);
          if (nick1 == sender_nick && span_id == span10.id) {
            console.log(700, nick1, sender_nick);
            //  span0.textContent = `${span0.textContent} + \n  ${reader_nick}`;
            span10.classList.add('Socket_span0_read');
            spans_.push(span10.textContent);

            console.log(new Date());
            setTimeout(() => {
              set_spans0((prev) => [...spans_]);
            }, 1000);
          }
        });

        /////

        ///////
        /*
        inViewport(span1, visible);

        function visible(span1) {
          // elt === elem
          console.log(span1.textContent + ' is visible in the window!');
          console.log(span1.getAttribute('sending_nick'));
          console.log(nick1);
          if (span1.getAttribute('sending_nick') !== nick1) {
            console.log(span1.getAttribute('sending_nick'));
            console.log(nick1);
            socket.emit(
              'read_conf',
              nick1,
              span1.getAttribute('sending_nick'),
              span1.textContent
            );
          }

          //nick1- это у кого на компе это высветилось, span.getAttribute('sending_nick') -это тот кто отправил сообщение
          socket.on('read_conf1', (reader_nick, sender_nick, message_text) => {
            console.log(
              ` reader nick ${reader_nick}, sender nick ${sender_nick}, message: ${message_text}`
            );
            let span1 = document.querySelector(`[sending_nick=${sender_nick}]`);
            console.log('span1', span1.textContent);
            console.log(nick1, sender_nick);
            if (nick1 == sender_nick) {
              console.log(nick1, sender_nick);
              //  span1.textContent = `${span0.textContent} + \n  ${reader_nick}`;
              span1.classList.add('Socket_span1_read');
              spans_.push(span1.textContent);

              console.log(new Date());
              setTimeout(() => {
                set_spans0((prev) => [...spans_]);
              }, 1000);
            }
          });
        }
*/
        ///////

        ///////

        if (span1 && div1 && i_email == message_i_email2) {
          setTimeout(() => {
            document.querySelector('.Socket_root2')?.appendChild(div1);
            document.getElementById(div_id_2)?.appendChild(span1);
          }, 1000);
        }
        if (span1 && div1 && i_email !== message_i_email2) {
          setTimeout(() => {
            document.querySelector('.Socket_root2')?.appendChild(div1);
            document.getElementById(div_id_2)?.appendChild(span1);
          }, 1000);
        }

        /////
        ///////

        //inViewport(div1, visible);

        // function visible(div) {
        // elt === elem
        //   console.log(div.id + ' is visible in the window!');
        // }

        ///////

        // document.querySelector('.socket_ul_1').appendChild(div);
      });
    }

    //ниже идет вывод сообщений в отдельную комнату
    if (i_email) {
      socket.on('newMessage_room', (message) => {
        console.log(111, message);
        this_time = message.date;
        if (this_time !== last_time) {
          span2 = document.createElement('span');
          div2 = document.createElement('div');
          console.log(9000, message.id);
          if (message.sender_i_email == i_email) {
            message_i_email1 = message.sender_i_email;
            span2.textContent = `Вы:   ${message.text} / ${message.date}`;

            span2.classList.add('Socket_li_mine_1');
            div2.classList.add('Socket_li_mine_div_1');
            div2.id = uuidv4();
            div_id_1 = div2.id;
            console.log('Ура1');
          } else {
            if (message.service == true) {
              span2.textContent = `Сервисное сообщение: ${message.text} / ${message.date}`;
            } else {
              span2.textContent = `${message.sender_nick}: ${message.text} / ${message.date}`;
            }

            span2.classList.add('Socket_li_1');
            div2.classList.add('Socket_li_div_1');
            div2.id = uuidv4();
            div_id_1 = div2.id;
            console.log('Ура2');
          }
          span2.id = message.id;
          span2.setAttribute('sending_nick', message.sender_nick);
          span2.setAttribute('date', message.date);

          setTimeout(() => {
            set_mes_id((prev) => message.id);
          }, 1000);
          span2.setAttribute('id', message.id);
          span2.addEventListener('mouseover', (e) => {
            console.log(`${span2.getAttribute('id')}`);

            if (e.target.getAttribute('sending_nick') !== nick1) {
              console.log(e.target.getAttribute('sending_nick'));
              console.log(nick1);
              socket.emit(
                'read_conf_room',
                nick1,
                e.target.getAttribute('sending_nick'),
                e.target.textContent,
                e.target.id,
                socket.id
              );
            }
          });

          socket.on('read_conf_room1', (reader_nick, sender_nick, span_id) => {
            console.log(
              ` reader nick ${reader_nick}, sender nick ${sender_nick}`
            );
            let span20 = document.getElementById(`${span_id}`);

            console.log(700, nick1, sender_nick);
            if (nick1 == sender_nick && span_id == span20.id) {
              console.log(700, nick1, sender_nick);
              //  span0.textContent = `${span0.textContent} + \n  ${reader_nick}`;
              span20.classList.add('Socket_span0_read');
              spans_.push(span20.textContent);

              console.log(new Date());
              setTimeout(() => {
                set_spans0((prev) => [...spans_]);
              }, 1000);
            }
          });

          ///////
          /*
          inViewport(span2, visible2);

          function visible2(span) {
            // elt === elem
            console.log(span.id + ' is visible in the window!');
          }
*/
          ///////

          if (span2 && div2 && i_email == message_i_email1) {
            setTimeout(() => {
              console.log('хе хе 1');
              document.querySelector('.Socket_root3')?.appendChild(div2);
              document.getElementById(div_id_1)?.appendChild(span2);
            }, 1000);
          }
          if (span2 && div2 && i_email !== message_i_email1) {
            setTimeout(() => {
              console.log(i_email, message_i_email1);
              document.querySelector('.Socket_root3')?.appendChild(div2);
              document.getElementById(div_id_1)?.appendChild(span2);
            }, 1000);
          }
        }
        last_time = this_time;
        return () => {
          controller.abort();
          socket.off('newMessage').off();
          socket.off('newPrivate').off();
          socket.off('newMessage_room').off();
        };
      });
    }
  }, [
    mes_id,
    JSON.stringify(users_online1),
    JSON.stringify(real_rooms_online),
    room_mess_state,
  ]);
  /*
  useEffect(() => {
    console.log(150000000, users_online1, users_online_st);
  }, [socket_id, users_online_st]);
*/

  useEffect(() => {
    fetch(`http://localhost:4000/api/users`, {
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
        console.log(1505, json);
        setusersAll((prev) => [...json]);
      })
      .catch((error) => {
        console.log(165, error);
      });
    setTimeout(() => {
      console.log(usersAll);
    }, 5000);
  }, []);

  return (
    <div>
      <div className='Socket_chat_container'>
        <h3 className='Socket_Obshi_Chat'>Общий чат</h3>
        {users_online1 && (
          <h4 className='Socket_online'>
            On-Line:
            {users_online1?.map((el) => (
              <ul>&nbsp; {el?.nick}, </ul>
            ))}
          </h4>
        )}
        <h4 className='Socket_Your_nick'>Ваш ник: {nick1}</h4>
      </div>
      <div className='Socket_Chat_Window'>
        <div>
          {m_array[0] &&
            m_array.map((el, i) => (
              <ul id={el._id}>
                {i_email && el.i_email == i_email && (
                  <div className='Socket_li_mine_div'>
                    <span className='Socket_li_mine'>
                      Вы: {el.message} / {el.date}
                      <WindowFocusHandler i_email={i_email} />
                    </span>
                  </div>
                )}
                {i_email && el.i_email !== i_email && (
                  <div className='Socket_li_div'>
                    <span className='Socket_li'>
                      {el.nick}: {el.message} / {el.date}
                      <WindowFocusHandler i_email={i_email} />
                    </span>
                  </div>
                )}
              </ul>
            ))}
        </div>

        {i_email && (
          <div className='Socket_root1'>
            <WindowFocusHandler i_email={i_email} />
          </div>
        )}
      </div>
      <div className='Socket_chat_container Socket_cont_1'>
        {i_email && (
          <div className='Socket_Current_Chat'>
            <form onSubmit={handleSubmit}>
              <br />
              <label>
                Сообщение:
                <input type='text' name='message' />
              </label>

              <button type='submit' className='Socket_button Socket_send'>
                отправить сообщение
              </button>
            </form>
          </div>
        )}
        {!i_email && (
          <div>Чтобы воспользоваться чатом нужно войти в систему</div>
        )}
      </div>
      <div className='Socket_spacing'></div>
      <div className='Socket_chat_container Socket_cont_1'>
        <h3 className='Socket_Obshi_Chat '>Приватные сообщения</h3>

        <h4 className='Socket_Your_nick'>Ваш ник: {nick1}</h4>
        <h4 className='Socket_online '>Выберите собеседника: </h4>
        {users_online1 && (
          <h4 className='Socket_online Socket_online_buttons_cont'>
            {users_online1.map((el, i) => (
              <ul className=''>
                <button
                  className='Socket_nicks'
                  id={el?.nick}
                  onClick={nickClick}
                >
                  {el?.nick}
                </button>
              </ul>
            ))}
          </h4>
        )}
      </div>
      <div className='Socket_Chat_Window'>
        <div>
          {m_array_private_selected[0] &&
            m_array_private_selected.map((el, i) => (
              <ul id={el._id}>
                {i_email && el.sender_i_email == i_email && (
                  <div className='Socket_li_mine_div'>
                    <span className='Socket_li_mine'>
                      Вы: {el.message} / {el.date}
                      <WindowFocusHandler i_email={i_email} />
                    </span>
                  </div>
                )}
                {i_email && el.receiver_nick == nick1 && (
                  <div className='Socket_li_div'>
                    <span className='Socket_li'>
                      {el.sender_nick}: {el.message} / {el.date}
                      <WindowFocusHandler i_email={i_email} />
                    </span>
                  </div>
                )}
              </ul>
            ))}
        </div>

        {i_email && (
          <div className='---Socket_Current_Chat'>
            {i_email && (
              <div className='Socket_root2'>
                <WindowFocusHandler i_email={i_email} />
              </div>
            )}
          </div>
        )}
      </div>
      <div className='Socket_chat_container Socket_cont_1'>
        {i_email && nick_butt && (
          <div className='Socket_Current_Chat'>
            <form onSubmit={handleSubmit_private}>
              {nick_butt && <div> Получатель сообщения: {nick_butt} </div>}
              {!nick_butt && <div>Кликните на получателя сообщения</div>}

              <label>
                Сообщение:
                <input type='text' name='message' />
              </label>
              <br />
              <button type='submit' className='Socket_button'>
                отправить сообщение
              </button>
            </form>
          </div>
        )}
        {!i_email && (
          <div>Чтобы воспользоваться чатом нужно войти в систему</div>
        )}
      </div>
      <div className='Socket_spacing'></div>
      <div className='Socket_spacing'></div>
      <div className='Socket_spacing'></div>
      <div className='Socket_spacing'></div>

      <div className='Socket_chat_container'>
        <h3 className='Socket_Obshi_Chat'>Обсуждения в частных группах</h3>
        <h4 className='Socket_online '>Выберите комнату для общения: </h4>

        {real_rooms_online && (
          <h4 className='Socket_online Socket_online_buttons_cont'>
            {real_rooms_online.map((el, i) => (
              <ul className=''>
                <button className='Socket_nicks' id={el} onClick={roomClick}>
                  {el}
                </button>
              </ul>
            ))}
          </h4>
        )}
      </div>
      <div className='Socket_Chat_Window'>
        <div>
          {m_array_room_selected[0] &&
            m_array_room_selected.map((el, i) => (
              <ul id={el._id}>
                {i_email && el.sender_i_email == i_email && (
                  <div className='Socket_li_mine_div'>
                    <span className='Socket_li_mine'>
                      Вы: {el.message} / {el.date}
                      <WindowFocusHandler i_email={i_email} />
                    </span>
                  </div>
                )}
                {i_email && el.sender_i_email !== i_email && (
                  <div className='Socket_li_div'>
                    <span className='Socket_li'>
                      {el.sender_nick}: {el.message} / {el.date}
                      <WindowFocusHandler i_email={i_email} />
                    </span>
                  </div>
                )}
              </ul>
            ))}
        </div>

        {i_email && (
          <div className='Socket_root3'>
            <WindowFocusHandler i_email={i_email} />
          </div>
        )}
      </div>
      <div className='Socket_chat_container Socket_cont_1'>
        {i_email && (
          <div className='Socket_Current_Chat'>
            <br />
            <ul className='socket_ul_2'></ul>
            <form onSubmit={handle_Create_Room}>
              <label>
                Создать комнату:
                <input type='text' name='room_name' />
                <button type='submit'>Создать</button>
              </label>
            </form>

            <br />
            <h4>Выбрана комната:&nbsp;{real_room_selected}</h4>
            <br />
            <form onSubmit={room_message_submit}>
              <label>
                Сообщение:
                <input type='text' name='room_message' />
              </label>
              <br />
              <button type='submit' className='Socket_button'>
                отправить сообщение
              </button>
            </form>
            <br />
          </div>
        )}
        {!i_email && (
          <div>Чтобы воспользоваться чатом нужно войти в систему</div>
        )}
      </div>
      <div className='Socket_spacing'></div>
      <div className='Socket_spacing'></div>
      <div className='Socket_spacing'></div>
      <div className='Socket_spacing'></div>
    </div>
  );
}
export default Socket;
