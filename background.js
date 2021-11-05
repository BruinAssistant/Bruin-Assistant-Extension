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
    if (request.contentScriptQuery == "classLocationScraping") {
        sendResponse(performClassLocationScraping(request.document));
        return true;
    }
});

function performClassLocationScraping(doc) {
    //return "AHHAHAHAHAHAHAHOLD backgroudn_hellO";


    console.log("PERFORM CLASS SCRAPING AYYAYAYYA");

    let locations_list = [];
    let num = 0;

    let form = doc.forms;
    console.log(form);
    return "AHHAHAHAHAHAHAHOLD backgroudn_hellO";
    console.log(form);
    form[0][40].value = "Aerospace Studies (AERO ST)";
    form[0][41].value = "A - Leadership Laboratory";
    form[0][42].disabled = false;
    return "AHHAHAHAHAHAHAHOLD backgroudn_hellO";
    form[0].submit();

    locations_list.push(num);

    console.log(form);

    return "AHHAHAHAHAHAHAHOLD backgroudn_hellO";
}