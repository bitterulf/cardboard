var client = new Faye.Client('http://localhost:8080/pubsub');

var currentPerson = 0;

var lastCategory = 0;
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

var setupScene = function() {
  $('#video').hide();
  $('#scrollcontainer').scrollTo('#scrolltarget9');
  console.log('setup complete');
};

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

var hideEmpty = function() {
  var name = persons[currentPerson-1];
  if (name == 'kai') {
    $('#food_button').removeClass('disabled');
    $('#work_button').removeClass('disabled');
    $('#transport_button').removeClass('disabled');
    $('#media_button').addClass('disabled');
  }
  if (name == 'malwina') {
    $('#food_button').removeClass('disabled');
    $('#work_button').addClass('disabled');
    $('#transport_button').addClass('disabled');
    $('#media_button').removeClass('disabled');
  }
  if (name == 'martin') {
    $('#food_button').addClass('disabled');
    $('#work_button').removeClass('disabled');
    $('#transport_button').removeClass('disabled');
    $('#media_button').removeClass('disabled');
  }
}

var updatePosition = function() {
  hideEmpty();

  if (currentCategory != lastCategory) {
    $( ".bg-img" ).animate({
      opacity: 0.0
    }, 200, function() {
      // Animation complete.
    });

    $( "."+categories[currentCategory-1] ).animate({
      opacity: 0.5
    }, 800, function() {
      // Animation complete.
    });
    lastCategory = currentCategory;
  }

  if (currentPerson && currentCategory) {
    var key = categories[currentCategory-1]+'_'+persons[currentPerson-1];
    if (posMap[key]) {
      moveAndPlay(posMap[key]);
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
    $('#curtain').show();
    myPlayer.play();
    window.setTimeout(function() {
      $('#video').show();
    }, 300);
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
  $('#curtain').hide();
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

  document.getElementById("music").volume = 0;

  var htracker = new headtrackr.Tracker();
  htracker.init(videoInput, canvasInput);
  htracker.start();

  var currentZ = 0;

  document.addEventListener('headtrackingEvent', function (event) {
    currentZ = event.z;
  }, false);

  var setVolume = function(volume) {
    videojs('video').ready(function () {
      this.volume(volume);
    });
  };

  window.setInterval(function () {
    if (currentZ != 0) {
      var darkness = 0;

      var volume = 1;
      var volume2 = 0;

      if (lastCategory == 2, currentCategory == 2) {
        darkness = currentZ/70;
      }

      if (lastCategory == 4, currentCategory == 4) {
        if (currentZ < 50) {
          volume = 1;
          volume2 = 0;
        }
        else if (currentZ < 70) {
          volume = 0.5;
          volume2 = 0.5;
        }
        else {
          volume = 0;
          volume2 = 1;
        }
      }

      $('#curtain').fadeTo( "slow" , darkness);

      setVolume(volume);
      document.getElementById("music").volume = volume2;
    }
  }, 500);

  showMenu(1);
  $('.detail').hide();

  setupScene();
});
