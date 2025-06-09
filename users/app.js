const express = require('express');

const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter');
const cors = require('cors');
const session = require('express-session');

///

const config = require('./config');

const connectMongo = require('./config_mongo');

const cors_settings = require('./config_cors');

///

const app = express();

///
//const PORT = process.env.PORT || 4000;

app.use(cors(cors_settings));

connectMongo();

////////

function errorHandler(err, req, res, next) {
  if (err) {
    res.send('<h1>Ошибка приложения, перезагрузите страницу</h1>');
    next();
  }
}

//app.get('/', (req, res) => {
//  console.log('прив');
//});
app.use('/api/users', userRouter);

//app.post('api/posts/newpost', (req, res) => console.log(189));

app.use(errorHandler);

app.listen(config.port, () =>
  console.log(`сервер users запущен на порте ${config.port}`)
);
