let state = {
    isPlaying: false,
    data: ""
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'updateState') {
        state.isPlaying = message.isPlaying;
        state.data = message.data;
    } else if (message.action === 'getState') {
        sendResponse(state);
    }
});