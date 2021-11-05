let color = '#3aa757';

let locations_list = [];
let num = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default button color set to %cgreen', `color: ${color}`);
});

/*chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {  
    console.log("NEW BACKGROUND Sending request " + request)  
    if (request.contentScriptQuery == "classLocationScraping") {
        performClassLocationScraping();
        sendResponse("NEW backgroudn_hellO");
        return true;
    }
});

/*function performClassLocationScraping() {
    console.log("PERFORM CLASS SCRAPING AYYAYAYYA");

    let form = document.forms;
    console.log(form);
    form[0][40].value = "Aerospace Studies (AERO ST)";
    form[0][41].value = "A - Leadership Laboratory";
    form[0][42].disabled = false;
    form[0].submit();

    locations_list.push(num);

    console.log(form);
}*/