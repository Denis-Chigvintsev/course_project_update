const express = require('express');
const mongoose = require('mongoose');
const app = require('../app');
const { v4: uuidv4 } = require('uuid');
const Posts = require('../models/post.shema');
const Users = require('../models/users.shema');
const Chat = require('../models/chat.schema');
const PrivateChat = require('../models/private_chat.model');
const RoomChat = require('../models/room_chat.model');
const Real_rooms = require('../models/room_list');
const postRouter = express.Router();
const path = require('path');
//////response
const { successResponse, doneResponse } = require('../responseHandler');
/////

let fl_id;

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/Net_Extend/COURSE_PROJECT 2nd/client/my_app/public/img');
  },
  filename: function (req, file, cb) {
    cb(null, fl_id + '--' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    console.log('разрешено использовать только jpg и png');
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 1 },
});

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const session = require('express-session');

const MongoStore = require('connect-mongo')(session);
///
///подключаю mongoStore Для хранения сессий
const dbString =
  'mongodb://denis:chigvintsev@localhost:501/project?authSource=admin';
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const connection = mongoose.createConnection(dbString, dbOptions);

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});
postRouter.use(
  session({
    secret: 'cats', ///дб  в переменных окружения
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

////////////////////
passport.use(
  new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    let selected_user; /*"это предварительный user после проверки пароля он станет checked user"*/

    Users.find({ email: email })
      .then((i_user) => {
        selected_user = i_user;
        console.log(selected_user, selected_user);
        if (!selected_user.toString()) {
          console.log('неправильный email');
          done(null, false, { message: 'неправильный email' });
        } else {
          let isPassCorrect;

          bcrypt.compare(
            password,
            selected_user[0].password,
            (err, response) => {
              isPassCorrect = response;
            }
          );

          setTimeout(() => {
            if (
              selected_user.toString() &&
              selected_user[0].password &&
              isPassCorrect
            ) {
              checked_user = selected_user;
              return done(null, checked_user);
            } else {
              console.log('неправильный password');
              done(null, false, { message: 'неправильное password' });
            }
          }, 500);
        }
      })
      .catch((error) => console.log('ошибка', error));
  })
);
postRouter.use(passport.initialize());
postRouter.use(passport.session());

passport.serializeUser((checked_user, done) => {
  done(null, checked_user[0]._id);
});

passport.deserializeUser((_id, done) => {
  const checked_user = Users.find({ _id: _id });

  done(null, checked_user);
});

const authenticate = passport.authenticate('local', { session: true });
postRouter.use((req, res, next) => {
  next();
});

////////////////////////////////////////

postRouter.use(express.json());
function add_new_post(req, res) {
  console.log('денис молодец');
  req.body._id = uuidv4();
  let i_email = req.body.i_email;
  console.log(563, i_email);

  Users.find({ email: i_email })
    .then((user) => {
      //console.log(564, user);
      req.body.userID = user[0]._id;
      req.body.createdAt = Date.now();

      /////////
      const newPost = new Posts(req.body);
      newPost
        .save()
        .then((post) => {
          // res.json(post);
          doneResponse(res, 'done', post);
          console.log('запись объявления в базу');
        })
        .catch((error) => {
          console.log(error);
        });
      ///////////
    })
    .catch((error) => console.log(error));
}

function get_all_posts(req, res) {
  Posts.find()
    .then((posts) => {
      // res.json(posts);
      successResponse(res, 'Success', posts);
    })
    .catch();
}

/////////////////////////////
function get_post_by_id(req, res) {
  Posts.find({ _id: post_id })
    .then((post) => {
      //console.log(post);
      //res.json(post);
      successResponse(res, 'Success', post);
    })
    .catch();
}
function delete_post_by_id(req, res) {
  console.log(565);
  Posts.find({ _id: post_id })
    .then((post) => {
      Posts.findOneAndUpdate({ _id: post_id }, { isDeleted: true })
        .then((newpost) => {
          setTimeout(() => console.log(769, newpost), 5000);
          // res.json('done');
          doneResponse(res, 'done', newpost);
        })
        .catch(() => {});
    })
    .catch();
}

postRouter.param('post_id', (req, res, next, val) => {
  post_id = val;

  next();
});

postRouter.param('fl_id', (req, res, next, val) => {
  fl_id = val;

  next();
});
let i_email;
postRouter.param('i_email', (req, res, next, val) => {
  i_email = val;

  next();
});
let nick1;
postRouter.param('nick1', (req, res, next, val) => {
  nick1 = val;

  next();
});
let nick2;
postRouter.param('nick2', (req, res, next, val) => {
  nick2 = val;

  next();
});

let real_room;
postRouter.param('real_room', (req, res, next, val) => {
  real_room = val;

  next();
});

let chat_message;

function chat_read(req, res) {
  console.log('привет чат рид');
  Chat.find()
    .then((data) => {
      // res.json(data);
      successResponse(res, 'Success', data);
      //console.log(17, data);
    })
    .catch();
}
function private_chat_read(req, res) {
  PrivateChat.find({
    $or: [{ sender_nick: nick1 }, { receiver_nick: nick1 }],
  })
    .then((data) => {
      //res.json(data);
      successResponse(res, 'Success', data);
      // console.log(18, data);
      console.log(19, i_email, nick1);
    })
    .catch();
}

function private_chat_read_selected(req, res) {
  PrivateChat.find({
    $or: [
      { sender_nick: nick1, receiver_nick: nick2 },
      { sender_nick: nick2, receiver_nick: nick1 },
    ],
  })
    .then((data) => {
      //res.json(data);
      successResponse(res, 'Success', data);
      console.log(18, data);
      console.log(19, i_email, nick2);
    })
    .catch();
}

////

////

function real_room_chat_read_selected(req, res) {
  console.log(901, nick1, real_room);
  RoomChat.find({ real_room: real_room })
    .then((data) => {
      //res.json(data);
      successResponse(res, 'Success', data);
      console.log(118, data);
    })
    .catch();
}

function add_files(req, res) {
  FILES = [];
  setTimeout(() => console.log(988, req.file), 1000);

  let post_s;
  setTimeout(() => {
    Posts.find({ _id: fl_id })
      .then((post) => {
        FILES = [...post[0].images];

        setTimeout(() => {
          FILES.push(req.file);

          setTimeout(() => {
            Posts.findOneAndUpdate({ _id: fl_id }, { images: FILES })
              .then((newpost) => {
                setTimeout(() => console.log(769, newpost), 1000);
              })
              .catch(() => {});
            //return res.status(200).json('success');
            return doneResponse(res, 'success');
          }, 1000);
        }, 1000);
      })
      .catch();
  }, 5000);
}

function add_new_room(req, res) {
  req.body._id = uuidv4();

  const newRoom = new Real_rooms(req.body);
  console.log(req.body);
  newRoom
    .save()
    .then((new_room) => {
      //res.json(new_room);
      doneResponse(res, 'done', new_room);
      console.log('новая комната добавлена в базу', new_room);
    })
    .catch((error) => console.log(error));
}

function get_room_list(req, res) {
  console.log('here');
  Real_rooms.find()
    .then((real_rooms) => {
      //res.json(real_rooms);
      successResponse(res, 'Success', real_rooms);
      console.log(500, real_rooms);
    })
    .catch();
}

postRouter.get(
  '/get_room_list',
  passport.authenticate('session'),
  get_room_list
);

postRouter.get('/chat', passport.authenticate('session'), chat_read);

postRouter.get(
  '/private_chat/:i_email/:nick1/:nick2',
  passport.authenticate('session'),
  private_chat_read_selected
);

postRouter.get(
  '/private_chat/:i_email/:nick1',
  passport.authenticate('session'),
  private_chat_read
);

postRouter.get(
  '/real_room_chat/:i_email/:nick1/:real_room',
  passport.authenticate('session'),
  real_room_chat_read_selected
);

postRouter.post('/', passport.authenticate('session'), add_new_post);
postRouter.patch(
  '/:fl_id',
  passport.authenticate('session'),
  upload.single(`file`),
  add_files
);

postRouter.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field);
});

postRouter.get('/', passport.authenticate('session'), get_all_posts);
postRouter.get('/:post_id', passport.authenticate('session'), get_post_by_id);
postRouter.delete(
  '/:post_id',
  passport.authenticate('session'),
  delete_post_by_id
);

postRouter.post(
  '/add_new_room',
  passport.authenticate('session'),
  add_new_room
);
postRouter.get(
  '/get_room_list',
  passport.authenticate('session'),
  get_room_list
);

module.exports = postRouter;
