let defaults = {
    "dev_mode" : false,
    "mystery_mode" : false,
    "units_imperial" : false,
    "use_biking_time" : false
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set(defaults);
    console.log("Defaults set: developer setting (" + defaults["dev_mode"] + "), mystery setting (" + defaults["mystery_mode"] + "), imperial units (" + defaults["units_imperial"] + "), use biking time (" + defaults["use_biking_time"] + ")");
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
        if (request.url == ""){res => {
            sendResponse(""); 
            return true;
        }
        }
        else{
            fetch(request.url)
            .then(res => res.text())
            .then(res => sendResponse(res))
            .catch(error => console.log("Error: ", error))
        }
        return true;
    }
    if (request.contentScriptQuery == "getBruinwalkAverage"){
        fetch(request.url)
            .then(res => res.json())
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