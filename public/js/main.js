var client = new Faye.Client('http://localhost:8080/pubsub');

var currentPerson = 0;

var currentCategory = 0;

var clips = [
  'Kai-food',
  'Martin-work',
  'Kai-transporation',
  'Malwina-media',
  'Malwina-food',
  'Kai-work',
  'Martin-transportation',
  'Martin-media'
];

var markMenu = function(elem, id) {
  currentCategory = id;
  $('.topmenu span').removeClass('active');
  $(elem).addClass('active');
  updatePosition();
};

var categories = [
  'food',
  'work',
  'transport',
  'media'
];

var persons = [
  'kai',
  'malwina',
  'martin'
];

var posMap = {
  'food_kai': 1,
  'work_martin': 2,
  'transport_kai': 3,
  'media_malwina': 4,
  'food_malwina': 5,
  'work_kai': 6,
  'transport_martin': 7,
  'media_martin': 8
};

var updatePosition = function() {
  if (currentPerson && currentCategory) {
    var key = categories[currentCategory-1]+'_'+persons[currentPerson-1];
    if (posMap[key]) {
      playVideo(posMap[key]);
    }
    else {
      console.log('nothing found for', key);
    }
  }
};

var markBottomMenu = function(elem, id) {
  currentPerson = id;
  $('.bottommenu div').removeClass('active1');
  $('.bottommenu div').removeClass('active2');
  $('.bottommenu div').removeClass('active3');
  $(elem).addClass('active'+id);
  updatePosition();
};

var showMenu = function (id) {
  currentCategory = id;
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
