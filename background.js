let dev_mode = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ "dev_mode" : dev_mode });
    console.log('Default developer setting set to ' + dev_mode);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {  
    console.log("Sending request " + request)  
    if (request.contentScriptQuery == "getdata") {
        var url = request.url;
        fetch(url)
            .then(response => response.text())
            .then(response => sendResponse(response))
            .catch()
        return true;
    }
    if (request.contentScriptQuery == "postData") {
        fetch(request.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: request.data
        })
            .then(res => res.text())
            .then(res => sendResponse(res))
            .catch(error => console.log('Error:', error));
        return true;
    }
    if (request.contentScriptQuery == "getBruinwalkData") {
        fetch(request.url)
        .then(res => res.text())
        .then(res => sendResponse(res))
        .catch(error => console.log("Error: ", error))
        return true;
    }
    if (request.contentScriptQuery == "getTimeDistanceData") {
        fetch(request.url)
            .then(response => response.json())
            .then(response => sendResponse(response))
            .catch(error => console.log("Error: ", error))
        return true;
    }
});