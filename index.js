var Hapi = require('hapi');
var server = new Hapi.Server(8080);

server.route([
  {
    method: 'GET',
    path: '/cb',
    handler: function (request, reply) {
      reply('Hello, cardboard!');
    }
  },
  {
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './public',
        listing: true
      }
    }
  }
]);

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
