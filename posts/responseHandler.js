function handleResponse(res, statusCode, message, data) {
  res.status(statusCode).json(data);
}
////////////////////////////////////
function successResponse(res, message, data) {
  handleResponse(res, 200, message, data);
}

function doneResponse(res, message, data) {
  handleResponse(res, 201, message, data);
}

/////////////////////////////////////////
module.exports = {
  successResponse,
  doneResponse,
};
