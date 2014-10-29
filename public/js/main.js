var client = new Faye.Client('http://localhost:8080/pubsub');

var playVideo = function(id) {
  videojs(id).ready(function(){
    var myPlayer = this;
    myPlayer.currentTime(0);
    myPlayer.play();
  });
};

$(document).ready(function() {
  client.subscribe('/message', function(message) {
    console.log(message.text);
  }).then(function() {
    client.publish('/message', {text: 'example message'});
  });

  $('#button').click(function() {
    $('#scrollcontainer').scrollTo('#scrolltarget1', 1000);
  });

  $('#button2').click(function() {
    $('#scrollcontainer').scrollTo('#scrolltarget2', 1000);
  });

  $('#button3').click(function() {
    $('#scrollcontainer').scrollTo('#scrolltarget3', 1000);
    playVideo("example_video_1");
  });

  videojs("example_video_1").ready(function(){
    var myPlayer = this;
    myPlayer.on("ended", function(){
      $('#scrollcontainer').scrollTo('#scrolltarget1', 1000);
    });
  });

  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');

  var htracker = new headtrackr.Tracker();
  htracker.init(videoInput, canvasInput);
  htracker.start();

  document.addEventListener('headtrackingEvent', function(event) {
    console.log(event.z);
  }, false);
});
