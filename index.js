var Hapi = require('hapi');
var server = new Hapi.Server(8080);

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, cardboard!');
  }
});

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
