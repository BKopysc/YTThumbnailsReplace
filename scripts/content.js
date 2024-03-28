console.log('Content script loaded');

let URLS = [];
let prev_counter = -1;
let counter = 0;
let isPlaying = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'replaceThumbnails') {
    URLS = message.urls;
    setPlaying();
    replaceThumbnails(URLS);
  } else if (message.action === 'loadDefault') {
    setPlaying();
    loadDefault();
  } else if(message.action === 'pause'){
    setPaused();
  }
});

function replaceThumbnails(urls) {
  if (urls.length === 0) return;
  if(!isPlaying) return;

  console.log('Replacing thumbnails')
  const thumbnailContainers = document.querySelectorAll('ytd-rich-item-renderer ytd-rich-grid-media ytd-thumbnail');

  thumbnailContainers.forEach((container, index) => {
    counter++;
  });

  if (counter !== prev_counter) {
    thumbnailContainers.forEach((container, index) => {
      var imgElement = container.querySelector('yt-image img');
      if (imgElement) {
        imgElement.src = urlFromArray(urls, index);
        //stretch image to fill thumbnail with important
        imgElement.style.cssText += 'object-fit: fill !important;';
        counter++;
      }
    });
    prev_counter = counter;
    counter = 0;
  } else {
    counter = 0;
  }
}

//run fuction every 2 seconds
setInterval(() => {
    replaceThumbnails(URLS);
}, 1500);

function loadDefault() {
  // Logic to load default YouTube thumbnails
  console.log('Loading default thumbnails')
  URLS = defaultReplacementImgUrls;
  replaceThumbnails(URLS);
}

function urlFromArray(arr, index) {
  //cycle through urls array
  return arr[index % arr.length];
}

function setPlaying() {
  isPlaying = true;
}

function setPaused() {
  isPlaying = false;
}


const defaultReplacementImgUrls = [
  "https://upload.wikimedia.org/wikipedia/commons/9/96/Malczewski_Jacek_Autoportret1907.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/05/Lwowska_Galeria_Sztuki_-_Jacek_Malczewski_-_Christ_in_Emmaus.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Malczewski_Christ_and_the_Samaritan_woman.jpg/758px-Malczewski_Christ_and_the_Samaritan_woman.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Jacek_Malczewski_-_Self-portrait_in_armour_-_MP_375_-_National_Museum_in_Warsaw.jpg/741px-Jacek_Malczewski_-_Self-portrait_in_armour_-_MP_375_-_National_Museum_in_Warsaw.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Jacek_Malczewski_-_Self-Portrait_in_a_White_Attire_-_MNK_II-b-1762_-_National_Museum_Krak%C3%B3w.jpg/468px-Jacek_Malczewski_-_Self-Portrait_in_a_White_Attire_-_MNK_II-b-1762_-_National_Museum_Krak%C3%B3w.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Jacek_Malczewski_self-portrait_1925.jpg/800px-Jacek_Malczewski_self-portrait_1925.jpg"
];

