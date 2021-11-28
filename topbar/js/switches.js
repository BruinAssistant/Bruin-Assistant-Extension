// get all switches
let devModeToggleSwitch = document.getElementById("devModeToggle");
let devModeToggleSwitchInput = devModeToggleSwitch.querySelector('input[type="checkbox"]');

let mysteryModeToggleSwitch = document.getElementById("mysteryModeToggle");
let mysteryModeToggleSwitchInput = mysteryModeToggleSwitch.querySelector('input[type="checkbox"]');

let unitsImperialToggleSwitch = document.getElementById("unitsImperialToggle");
let unitsImperialToggleSwitchInput = unitsImperialToggleSwitch.querySelector('input[type="checkbox"]');

// init toggle switch to value stored in user's extension settings (found in Storage)
chrome.storage.sync.get("dev_mode", ({dev_mode}) => {
    console.log("dev_mode: ");
    console.log(dev_mode);
    devModeToggleSwitchInput.checked = dev_mode;
});

chrome.storage.sync.get("mystery_mode", ({mystery_mode}) => {
    console.log("mystery_mode: ");
    console.log(mystery_mode);
    mysteryModeToggleSwitchInput.checked = mystery_mode;
});

chrome.storage.sync.get("units_imperial", ({units_imperial}) => {
    console.log("units_imperial: ");
    console.log(units_imperial);
    unitsImperialToggleSwitchInput.checked = units_imperial;
});

// When toggle switch is switched, set/unset Developer mode
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

// When toggle switch is switched, set/unset Mystery mode
mysteryModeToggleSwitch.addEventListener("change", function () {
    if (mysteryModeToggleSwitchInput.checked) {
        setMysteryModeToggle(true);
        console.log("Mystery Mode enabled.");
    }
    else {
        setMysteryModeToggle(false);
        console.log("Mystery Mode disabled.");
    }
});

function setMysteryModeToggle(enable) {
    console.log("Setting mystery mode enable: " + enable);
    chrome.storage.sync.set({ "mystery_mode" : enable }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error reached while attempting to set mystery mode.");
        }
    });
}

// When toggle switch is switched, set/unset units in Imperial format
unitsImperialToggleSwitch.addEventListener("change", function () {
    if (unitsImperialToggleSwitchInput.checked) {
        setUnitsImperialToggle(true);
        console.log("Units imperial enabled.");
    }
    else {
        setUnitsImperialToggle(false);
        console.log("Units imperial disabled.");
    }
});

function setUnitsImperialToggle(enable) {
    console.log("Setting units imperial enable: " + enable);
    chrome.storage.sync.set({ "units_imperial" : enable }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error reached while attempting to set units to imperial.");
        }
    });
}