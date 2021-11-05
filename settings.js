// Initialize button with user's preferred color
let classLocationScrapingButton = document.getElementById("triggerClassLocationScraping");

// When the button is clicked, inject performClassLocationScraping into current page
classLocationScrapingButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: triggerClassLocationScraping,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function triggerClassLocationScraping() {
	console.log("PRESSED BUTTON");
	// send message to background script (to allow persistent storage of parsed results)
	chrome.runtime.sendMessage({
		contentScriptQuery: "classLocationScraping",
	}, function(response) {
		console.log("content script recieved back: " + response);
	});
}
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