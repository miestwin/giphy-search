function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function displayLoader(value) {
   if(value) {
     loader.style.display = "block";
   } else {
     loader.style.display = "none";
   }
}

function displayMessage(message = "", value = false) {
    if(value) {
     messageOutput.textContent = message;
     messageOutput.style.display = "block";
   } else {
     messageOutput.textContent = message;
     messageOutput.style.display = "none";
   }
}

function encodeInputValue(value) {
  return value.replace(/ /g, "+");
}

function handleErrors(response) {
  if(!response.ok) {
    displayMessage("Request failed: " + response.statusText, true);
  }
  return response;
}

function parseJSON(response) {
  return response.json();
}

function createVideoTag(src) {
   var video = document.createElement("video");
   video.autoplay = false;
   video.src = src;
   video.loop = true;
   return video;
}

function insertVideoTag(video) {
  target.appendChild(video);
}

function deleteVideos() {
  target.innerHTML = '';
}

function getGifs(videos) {
  if(videos.data.length == 0) {
    displayMessage("No gifs", true);
  }
  for(var gif in videos.data) {
      let video = createVideoTag(videos.data[gif].images.original.mp4);
      insertVideoTag(video);
    }
}

function loadGifs(url, type) {
  fetch(url).then(handleErrors).then(parseJSON).then(function(videos) {
      if(type === "search") {
        getGifs(videos);
      } else if(type === "random") {
        getRandomGifs(videos)
      }
    displayLoader(false);
  }).catch(function(error) {
    displayLoader(false);
    displayMessage("Request failed: " + error, true);
  });
}

function initSearch(api_key, value, type) {
  let url;
  deleteVideos();
  displayLoader(true);
  displayMessage(false);
  if(type === "search") {
    url = "http://api.giphy.com/v1/gifs/" + type + "?q=" + encodeInputValue(value) + "&api_key=" + api_key;
    loadGifs(url, type)
  } else if(type === "random") {
    url = "http://api.giphy.com/v1/gifs/" + type + "?tag=" + encodeInputValue(value) + "&api_key=" + api_key;
    loadGifs(url, type)
  } 
}

function getRandomGifs(videos) {
   let video = createVideoTag(videos.data.image_mp4_url);
   insertVideoTag(video)
}

function toogleVideoState(e) {
  if(e.target !== e.currentTarget) {
    let video = e.target;
    if(video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  e.stopPropagation();
}

var searchTerm = document.getElementById("searchTerm");
var searchRandom = document.getElementById("randomSearch");
var target = document.getElementById("gifs");
var loader = document.getElementById("loader");
var messageOutput = document.getElementById("message");

searchTerm.addEventListener("input", debounce(function() {
  initSearch("dc6zaTOxFJmzC", searchTerm.value, "search")
}, 500));

searchRandom.addEventListener("click", function() {
  initSearch("dc6zaTOxFJmzC", "", "random")
});

target.addEventListener("mouseover", toogleVideoState);
target.addEventListener("mouseout", toogleVideoState);