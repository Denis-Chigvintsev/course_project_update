const express = require('express');

const mongoose = require('mongoose');
const postRouter = require('./routers/postRouter');
const cors = require('cors');
///

const app = express();

const connectMongo = require('./config_mongo');

///
//const PORT = process.env.PORT || 4001;
const config = require('./config');
const cors_settings = require('./config_cors');
connectMongo();

app.use(cors(cors_settings));

////////
function errorHandler(err, req, res, next) {
  if (err) {
    res.send('<h1>Ошибка приложения, перезагрузите страницу</h1>');
    next();
  }
}

////////

app.use('/api/posts', postRouter);

app.use(errorHandler);

app.listen(config.PORT, () =>
  console.log(`сервер users запущен на порте ${config.PORT}`)
);
