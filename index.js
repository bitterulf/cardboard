var Hapi = require('hapi');
var faye = require('faye');

var server = new Hapi.Server(8080);

var bayeux = new faye.NodeAdapter({mount: '/pubsub', timeout: 45});

bayeux.attach(server.listener);

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
  },
  {
    method: 'GET',
    path: '/faye-client.js',
    handler: function (request, reply) {
      reply.file('./node_modules/faye/browser/faye-browser-min.js');
    }
  }
]);

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
