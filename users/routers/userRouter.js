const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
const app = require('../app');
const Users = require('../models/users.shema');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
//////response
const { successResponse, doneResponse } = require('../responseHandler');
/////

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
userRouter.use(
  session({
    secret: 'cats', ///дб  в переменных окружения
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
//////////////////////////////////////

async function post_signup(req, res) {
  console.log(req.body);

  const salt = await bcrypt.genSalt();
  await bcrypt.hash(req.body.password, salt).then((hash) => {
    req.body.password = hash;
    req.body._id = uuidv4();
    const newUser = new Users(req.body);
    Users.find({ email: req.body.email })
      .then((i_user) => {
        if (!i_user || !i_user[0]) {
          console.log(newUser);
          newUser
            .save()
            .then(() => {
              console.log(200, i_user[0]);
              console.log(`записываю пользователя в базу ${newUser}`);
              //res.json(newUser);
              doneResponse(res, 'done', newUser);
            })
            .catch((error) => console.log(error));
        } else res.json('failure');
        console.log(500, i_user[0]);
      })
      .catch((error) => {});
  });
}

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

userRouter.use(express.urlencoded({ exteded: false }));
userRouter.use(express.json());
userRouter.use(passport.initialize());
userRouter.use(passport.session());

passport.serializeUser((checked_user, done) => {
  done(null, checked_user[0]._id);
});

passport.deserializeUser((_id, done) => {
  const checked_user = Users.find({ _id: _id });

  done(null, checked_user);
});

const authenticate = passport.authenticate('local', { session: true });
userRouter.use((req, res, next) => {
  console.log(830, req.session);
  next();
});

userRouter.post('/login', authenticate, (req, res, next) => {
  console.log('checked_user', checked_user);
  if (checked_user) {
    // res.json(checked_user);
    doneResponse(res, 'done', checked_user);
    console.log('Cookies: ', res._headers['set-cookie']);
    console.log(910, checked_user, req.session);
  } else {
    return res.status(401);
  }
  next();
});
userRouter.use((req, res, next) => {
  //  console.log('session', req.session, 'пользователь', checked_user);
  next();
});

async function get_by_email(req, res) {
  await Users.find({ email: email })
    .then((user) => {
      console.log(500500);

      // res.json(user);

      successResponse(res, 'Succsess', user);
    })
    .catch((error) => console.log(error));
}
let time_now;
let time_then = 0;
async function add_online(req, res) {
  time_now = Date.now();
  console.log((time_now - time_then) / 1000);
  await Users.findOneAndUpdate({ email: email }, { isOnline: true })
    .then((data) => {
      //res.json('done');
      doneResponse(res, 'done', data);
    })
    .catch(() => {});
  time_then = time_now;
}
/*
async function add_offline(req, res) {
  await Users.findOneAndUpdate({ email: email }, { isOnline: false })
    .then((newpost) => {
      setTimeout(() => console.log(769, newpost), 5000);
      res.json('done');
    })
    .catch(() => {});
}
*/
async function send_online_users(req, res) {
  await Users.find({ isOnline: true })
    .then((data) => {
      setTimeout(() => console.log(769, data), 5000);
      //  res.send(data);
      successResponse(res, 'Succsess', data);
    })
    .catch(() => {});
}

async function send_all_users(req, res) {
  await Users.find()
    .then((data) => {
      setTimeout(() => console.log(769, data), 5000);
      //  res.send(data);
      successResponse(res, 'Succsess', data);
    })
    .catch(() => {});
}

async function add_socket_id(req, res) {
  await Users.findOneAndUpdate(
    { email: email },
    { socket_id_: socket_id_, isOnline: true }
  )
    .then((data) => {
      console.log(50, data);
      setTimeout(() => {
        console.log(50, data);
      }, 1000);
      //   res.json('done');
      doneResponse(res, 'done', data);
    })
    .catch(() => {});
}

async function remove_socket_id(req, res) {
  await Users.findOneAndUpdate({ socket_id_: socket_id_ }, { isOnline: false })
    .then((data) => {
      console.log(70, data);
      //  res.json('done');
      doneResponse(res, 'done', data);
    })
    .catch(() => {});
}

userRouter.use(express.json());

userRouter.param('email', (req, res, next, val) => {
  email = val;

  next();
});

userRouter.param('socket_id_', (req, res, next, val) => {
  socket_id_ = val;

  next();
});

//////////////////////////////////////////

userRouter.post('/signup', post_signup);
userRouter.get(
  `/search/:email`,
  passport.authenticate('session'),
  get_by_email
);
userRouter.get('/', passport.authenticate('session'), send_all_users);

userRouter.get('/online', passport.authenticate('session'), send_online_users);

userRouter.patch(
  '/on/:email/:socket_id_',
  passport.authenticate('session'),
  add_socket_id
);

userRouter.patch(
  '/off/:socket_id_',
  passport.authenticate('session'),
  remove_socket_id
);

userRouter.patch('/on/:email', passport.authenticate('session'), add_online);

//userRouter.patch('/off/:email', passport.authenticate('session'), add_offline);

module.exports = userRouter;
