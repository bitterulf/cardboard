var client = new Faye.Client('http://localhost:8080/pubsub');

var clips = [
  'Kai-food',
  'Kai-transporation',
  'Kai-work',
  'Malwina-food',
  'Malwina-media',
  'Martin-media',
  'Martin-work'
];

var markMenu = function(elem) {
  $('.topmenu span').removeClass('active');
  $(elem).addClass('active');
};

var markBottomMenu = function(elem, id) {
  $('.bottommenu div').removeClass('active1');
  $('.bottommenu div').removeClass('active2');
  $('.bottommenu div').removeClass('active3');
  $(elem).addClass('active'+id);
};

var showMenu = function (id) {
  $('.menus').hide();
  $('.menu' + id).show();
};

var playVideo = function (id) {
  videojs('video').ready(function () {
    var myPlayer = this;
    myPlayer.src("/clips/"+clips[id-1]+".webm");
    myPlayer.currentTime(0);
    $('#video').show();
    myPlayer.play();
  });
};

var stopVideo = function () {
  videojs('video').ready(function () {
    var myPlayer = this;
    myPlayer.currentTime(0);
    myPlayer.stop();
  });
};

var moveAndPlay = function (id) {
  $('#video').hide();
  $('#scrollcontainer').scrollTo('#scrolltarget'+id, 1000);
  window.setTimeout(function(){
    playVideo(id);
  }, 1000);
};

$(document).ready(function () {
  client.subscribe('/message', function (message) {
    console.log(message.text);
  }).then(function () {
    client.publish('/message', {
      text: 'example message'
    });
  });

  videojs("video").ready(function () {
    this.on("ended", function () {
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
