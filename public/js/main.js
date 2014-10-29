var client = new Faye.Client('http://localhost:8080/pubsub');

var showMenu = function (id) {
  $('.menus').hide();
  $('.menu' + id).show();
};

var playVideo = function (id) {
  videojs(id).ready(function () {
    var myPlayer = this;
    myPlayer.currentTime(0);
    myPlayer.play();
  });
};

$(document).ready(function () {
  client.subscribe('/message', function (message) {
    console.log(message.text);
  }).then(function () {
    client.publish('/message', {
      text: 'example message'
    });
  });

  $('.button1').click(function () {
    $('#scrollcontainer').scrollTo('#scrolltarget1', 1000);
    showMenu(1);
  });

  $('.button2').click(function () {
    $('#scrollcontainer').scrollTo('#scrolltarget2', 1000);
    playVideo("example_video_1");
    showMenu(2);
  });

  $('.button3').click(function () {
    $('#scrollcontainer').scrollTo('#scrolltarget3', 1000);
    showMenu(3);
  });

  $('.button4').click(function () {
    $('#scrollcontainer').scrollTo('#scrolltarget4', 1000);
    showMenu(4);
  });

  videojs("example_video_1").ready(function () {
    var myPlayer = this;
    myPlayer.on("ended", function () {
      $('#scrollcontainer').scrollTo('#scrolltarget1', 1000);
      showMenu(1);
    });
  });

  var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');

  var htracker = new headtrackr.Tracker();
  htracker.init(videoInput, canvasInput);
  htracker.start();

  var currentZ = 0;

  document.addEventListener('headtrackingEvent', function (event) {
    currentZ = event.z;
  }, false);

  window.setInterval(function () {
    if (currentZ != 0) {
      if (currentZ < 45) {
        $('.detail').show();
      } else {
        console.log('far');
        $('.detail').hide();
      };
    }
  }, 1000);

  showMenu(1);
  $('.detail').hide();
});
