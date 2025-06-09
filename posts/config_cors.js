const cors_settings = {
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
  credentials: true,
};

module.exports = cors_settings;
