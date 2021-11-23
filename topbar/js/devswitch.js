let devModeToggleSwitch = document.getElementById("devModeToggle");
let devModeToggleSwitchInput = devModeToggleSwitch.querySelector('input[type="checkbox"]');

// Init toggle switch to value stored in user's extension settings (found in Storage)
chrome.storage.sync.get("dev_mode", ({dev_mode}) => {
    console.log("dev_mode: ");
    console.log(dev_mode);
    devModeToggleSwitchInput.checked = dev_mode;
});

// When toggle switch is switched, set/unset Developer Mode
devModeToggleSwitch.addEventListener("change", function () {
    if (devModeToggleSwitchInput.checked) {
        setDevModeToggle(true);
        console.log("Developer Mode enabled.");
    }
    else {
        setDevModeToggle(false);
        console.log("Devloper Mode disabled.");
    }
});

function setDevModeToggle(enable) {
    console.log("Setting dev mode enable: " + enable);
    chrome.storage.sync.set({ "dev_mode" : enable }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error reached while attempting to set dev mode.");
        }
    });
}
