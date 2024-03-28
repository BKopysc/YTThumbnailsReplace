successElem = document.getElementById('load-success');
errorElem = document.getElementById('load-error');
submitButton = document.getElementById('submit-btn');
defaultButton = document.getElementById('load-default-btn');
pauseButton = document.getElementById('stop-btn');
textarea = document.getElementById('urlsInput');


document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        var url = currentTab.url;
        const youtubeUrl = "https://www.youtube.com";
      
        // Check if the current URL matches the specified site
        if (!url.startsWith(youtubeUrl)) {
            document.body.innerHTML = "<h1 class='title is-4 has-text-warning has-text-centered pt-5'>Only works on youtube.com</h1>";
        } else {
            getInitialState();
        }
      });
});

function getInitialState(){
    chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
        pauseButton.disabled = !response.isPlaying;
        textarea.value = response.data;
        console.log("Get State");
    });    
}

submitButton.addEventListener('click', function () {
    let urls = textarea.value.split(',');
    urlsArr = validateInput(textarea);

    if (urlsArr.length === 0) {
        showError();
        clearTextarea();
        return;
    } else {
        urls = urlsArr;
        showSuccess();
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'replaceThumbnails', urls: urls });
    });

    showSuccess();
    updateState();
});

defaultButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'loadDefault' });
    });

    showSuccess();
    updateState();
});

pauseButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'pause' });
    });

    disablePauseButton();
    clearInfos();
    updateState();
});

textarea.addEventListener('input', function () {
    if (textarea.value === '') {
        updateState();
    }
});

function showSuccess() {
    successElem.style.display = 'block';
    errorElem.style.display = 'none';
    enablePauseButton();
}

function enablePauseButton(){
    pauseButton.disabled = false;
}

function disablePauseButton(){
    pauseButton.disabled = true;
    
}

function validateInput(input) {
    let urls = input.value.split(',');
    let urlsArray = [];

    urls.forEach(url => {
        if (url.includes('http') || url.includes('https')) {
            if (url.split('http').length === 2 || url.split('https').length === 2) {
                urlsArray.push(url);
            }
        }
    });

    return urlsArray;
}

function clearInfos() {
    successElem.style.display = 'none';
    errorElem.style.display = 'none';
}


function showError() {
    successElem.style.display = 'none';
    errorElem.style.display = 'block';
}

function clearTextarea() {
    textarea.value = '';
}


function updateState() {
    const isPlaying = !pauseButton.disabled;
    const data = textarea.value
    chrome.runtime.sendMessage({ action: 'updateState', isPlaying, data });
}