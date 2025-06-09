const express = require('express');
const mongoose = require('mongoose');
const Chat = require('./models/chat.model');
const PrivateChat = require('./models/private_chat.model');
const RoomChat = require('./models/room_chat.model');
const { v4: uuidv4 } = require('uuid');

const http = require('http');
const cors = require('cors');

const connectMongo = require('./config_mongo');

const app = express();
let room_;
let socketid_;
let sender_nick_;
let sender_i_email_;
let socket_receiver_nick_;
let _id;

let now;
let last_time;
let users_online = [];
let real_rooms = [];

app.use(cors());

connectMongo();

const server = http.createServer(app);

const { Server } = require('socket.io');
const { SocketAddress } = require('net');

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

fetch(`http://localhost:4001/api/posts/get_room_list`)
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    let json__ = [];
    json.forEach((el) => json__.push(el.real_room_name));
    real_rooms = [...json__];
  })
  .catch((error) => console.log(error));

io.on('connection', (socket) => {
  //console.log(121, io.engine.clientsCount);
  // console.log(`сокет подсоединен   ${socket.id}`);

  socket.once('disconnect', (reason) => {
    console.log(100, reason, socket.id);

    fetch(`http://localhost:4000/api/users/off/${socket.id}`, {
      method: 'PATCH',
    })
      .then((res) => {
        //  console.log(504, res.status);

        fetch(`http://localhost:4000/api/users/online`)
          .then((res) => {
            //          console.log(504);
            return res.json();
          })
          .then((json) => {
            //console.log(501, json);
            //      socket.broadcast.emit('users_online', json);
            socket.emit('users_online', json, users_online, uuidv4());
            socket.broadcast.emit('users_online', json, users_online, uuidv4());
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  });

  ///ниже мы вытаскиваем пользователей online -они у нас обновляются при каждом коннекте и каждом дисконнекте. Но нужно наверное ввести задержечку

  socket.on('join-room', (room) => {
    socket.join(room);
  });

  socket.on('real_room_message', (message, real_room, nick1, i_email) => {
    console.log(900, message, real_room, nick1, i_email);

    date = new Date();
    time = `${
      date.getUTCHours() + 3
    }:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

    const i_room_chat = {
      _id: uuidv4(),
      sender_nick: nick1,
      sender_i_email: i_email,
      message: message.message,
      date: time,
      real_room: real_room,
    };

    const new_i_room_chat = new RoomChat(i_room_chat);

    new_i_room_chat
      .save()
      .then(() => {
        console.log('запись в базу room_chat');
      })
      .catch((error) => console.log(error));
    console.log('real_room', real_room);
    io.in(real_room).emit('newMessage_room', {
      text: message.message,
      date: i_room_chat.date,
      id: i_room_chat._id,
      sender_nick: nick1,
      sender_i_email: i_email,
      real_room: real_room,
    });
  });

  socket.on('read_conf', (reader_nick, sender_nick, message_text, span_id) => {
    console.log(reader_nick, sender_nick, span_id);
    io.sockets.emit(
      'read_conf1',
      reader_nick,
      sender_nick,
      message_text,
      span_id
    );
  });

  socket.on(
    'read_conf_private',
    (reader_nick, sender_nick, message_text, span_id, socket_id) => {
      console.log(reader_nick, sender_nick, span_id);
      io.emit('read_conf_private1', reader_nick, sender_nick, span_id);
    }
  );

  socket.on(
    'read_conf_room',
    (reader_nick, sender_nick, message_text, span_id, socket_id) => {
      console.log(reader_nick, sender_nick, span_id);
      io.emit('read_conf_room1', reader_nick, sender_nick, span_id);
    }
  );

  socket.on('user_connected', (data) => {
    // console.log(499, data.socket_id, data.i_email);
    let i_data = data;

    let index = users_online.findIndex(
      (el) => el.i_data.i_email == i_data.i_email
    );

    // console.log(-500, index);
    if (i_data.i_email && index == -1) {
      users_online.push({ i_data });
    } else {
      // console.log(989, io.engine.clientsCount);
      //socket.disconnect([true]);

      console.log(989, io.engine.clientsCount);
    }
    console.log(500, users_online);

    setTimeout(() => {
      fetch(`http://localhost:4000/api/users/online`)
        .then((res) => {
          //.log(504);
          return res.json();
        })
        .then((json) => {
          setTimeout(() => {
            console.log(501, json);
            //      socket.broadcast.emit('users_online', json);
            socket.emit('users_online', json, users_online, uuidv4());
            socket.broadcast.emit('users_online', json, users_online, uuidv4());
          }, 0);
        })
        .catch((error) => console.log(error));
    }, 1000);
  });

  socket.on('createPublic', (message1, nick1, i_email) => {
    let date = new Date();
    let time = `${
      date.getUTCHours() + 3
    }:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
    console.log(message1);
    const { message } = message1;

    const i_chat = {
      _id: uuidv4(),
      message: message,
      nick: nick1,
      i_email: i_email,
      date: time,
    };

    const new_i_chat = new Chat(i_chat);

    new_i_chat
      .save()
      .then(() => {
        console.log('запись сообщения в базу');
      })
      .catch((error) => {
        console.log(error);
      });

    socket.broadcast.emit('newMessage', {
      text: message,
      nick: nick1,
      i_email: i_email,
      date: time,
      id: i_chat._id,
    });
    console.log(1212, nick1, i_chat._id);
  });

  socket.on(
    'createMessage',
    (
      message1,
      room,
      socket_id,
      socket_receiver_nick,
      sender_nick,
      sender_i_email
    ) => {
      room_ = room; // здесь не рум в чистом виде - а receiver socket id, но оставил под именем room
      socketid_ = socket_id;
      sender_nick_ = sender_nick;
      sender_i_email_ = sender_i_email;
      socket_receiver_nick_ = socket_receiver_nick;

      console.log(
        2000,
        message1,
        room_,
        socketid_,
        sender_nick_,
        sender_i_email_,
        socket_receiver_nick_
      );
      const { message } = message1;

      console.log(message1);

      date = new Date();
      time = `${
        date.getUTCHours() + 3
      }:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
      console.log(time);

      const i_chat_private = {
        _id: uuidv4(),
        sender_nick: sender_nick_,
        receiver_nick: socket_receiver_nick_,
        sender_i_email: sender_i_email_,
        message: message,
        date: time,
      };

      const new_i_chat_private = new PrivateChat(i_chat_private);

      new_i_chat_private
        .save()
        .then(() => {
          console.log('запись сообщения в базу - privateChat');
        })
        .catch((error) => {
          console.log(error);
        });

      socket.to(room_).emit('newPrivate', {
        // здесь рум это receiver id
        text: message,
        date: time,
        id: i_chat_private._id,
        sender_nick: sender_nick_,
        sender_i_email: sender_i_email_,
        socket_receiver_nick: socket_receiver_nick_,
      });
      console.log(3000, socketid_);
      socket.to(socketid_).emit('newPrivate', {
        text: message,
        date: time,
        id: i_chat_private._id,
        sender_nick: sender_nick_,
        sender_i_email: sender_i_email_,
        socket_receiver_nick: socket_receiver_nick_,
      });
    }
  );
  socket.on('create_room', (data) => {
    if (data.real_room_name !== '') {
      console.log(7000, data.real_room_name, real_rooms);
      if (real_rooms.indexOf(data.real_room_name) == -1) {
        console.log(8000, real_rooms.indexOf(data.real_room_name));
        socket.join(data.real_room_name);
        console.log(data.real_room_name, socket.id);
        real_rooms.push(data.real_room_name);

        fetch(`http://localhost:4001/api/posts/add_new_room`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ real_room_name: data.real_room_name }),
        })
          .then((res) => {
            return res.json();
          })
          .then((json) => {
            console.log(5000, json);

            fetch(`http://localhost:4001/api/posts/get_room_list`)
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                console.log(6000, json);
                let json_ = [];
                json.forEach((el) => json_.push(el.real_room_name));
                setTimeout(() => {
                  socket.emit('real_rooms_online', json_);
                  socket.broadcast.emit('real_rooms_online', json_);
                }, 100);
              })
              .catch((error) => console.log(error));
          })

          .catch((error) => console.log(error));

        console.log(199, real_rooms);

        let date = new Date();
        let time = `${
          date.getUTCHours() + 3
        }:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

        io.in(data.real_room_name).emit('newMessage_room', {
          text: `Вы создали комнату ${data.real_room_name}, для начала диалога в ней перейдите в нее, нажав на кнопку выше `,
          date: time,
          id: uuidv4(),
          sender_nick: data.nick,
          sender_i_email: data.i_email_,
          real_room_name: data.real_room_name,
          service: true,
        });
      } else {
        let date = new Date();
        let time = `${
          date.getUTCHours() + 3
        }:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

        console.log(9000, real_rooms.indexOf(data.real_room_name));
        io.in(data.real_room_name).emit('newMessage_room', {
          text: `Комната c именем ${data.real_room_name}  уже существует, попробуйте другое имя`,
          date: time,
          id: uuidv4(),
          sender_nick: data.nick,
          sender_i_email: data.i_email_,
          real_room_name: data.real_room_name,
          service: true,
        });
      }
    }
  });
});

function errorHandler(err, req, res, next) {
  if (err) {
    res.send('<h1>Ошибка приложения, перезагрузите страницу</h1>');
    next();
  }
}

app.use(errorHandler);

PORT = process.env.port || 4002;

server.listen(4002, () => console.log('сервер socketa на порту 4002 запущен'));
