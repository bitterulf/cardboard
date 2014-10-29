var client = new Faye.Client('http://localhost:8080/pubsub');

$(document).ready(function() {
  client.subscribe('/message', function(message) {
    console.log(message.text);
  }).then(function() {
    client.publish('/message', {text: 'example message'});
  });
  console.log('started');
});
