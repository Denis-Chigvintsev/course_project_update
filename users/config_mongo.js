const mongoose = require('mongoose');

function connectMongo() {
  mongoose
    .connect(
      'mongodb://denis:chigvintsev@localhost:501/project?authSource=admin'
    )
    .then(() => console.log('база подключена'))
    .catch((error) => console.log(error));
}

module.exports = connectMongo;
