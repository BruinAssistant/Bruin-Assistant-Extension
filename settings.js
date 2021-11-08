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


var api = "https://class-planner-assistant-dev.herokuapp.com/api";
var display = document.getElementById('display');

// Make a basic fetch request to determine cookie authentication
function checkAuth(evt) {
  // Label that will display result
  console.log("Checking auth!");

  // This route (after middleware) basically just returns if req.isAuthenticated()
  // https://class-planner-assistant-dev.herokuapp.com/protected-route
  fetch(`${api}/authenticated`)
    .then(res => res.text())
    .then(res => display.textContent = res)
    .catch(err => {console.log("Error!", err); display.textContent = "" + err; return;});
}

function getFriends(evt) {
  var ul = document.getElementById('friends-display');
  fetch(`${api}/friends/list`)
    .then(res => res.text())
    .then(txt => {
      console.log("Parsed: ", txt);
      return txt;
    })
    .then(txt => JSON.parse(txt))
    .then(json => {
      if (json.code == 1) throw json.msg;
      return json.msg;
    }).then(friends => {
      console.log("Friends: ", friends);
      // https://stackoverflow.com/a/3955238
      while (ul.firstChild) ul.removeChild(ul.lastChild);
      for (const friend of friends) {
        let listitem = document.createElement('li');
        listitem.appendChild(document.createTextNode(friend.username));
        ul.appendChild(listitem);
        console.log(`Friend ${friend.username} has id ${friend.id}`);
      }
    }).catch(err => {console.log("Error!", err); display.textContent = "" + err; return;});
}

function getInvites(evt) {
  var ul = document.getElementById('invites-display');
  fetch(`${api}/friends/pending`)
    .then(res => res.text())
    .then(txt => JSON.parse(txt))
    .then(json => {
      if (json.code == 1) throw json.msg;
      return json.msg;
    }).then(friends => {
      console.log("Invites: ", friends);
      // https://stackoverflow.com/a/3955238
      while (ul.firstChild) ul.removeChild(ul.lastChild);
      for (const friend of friends) {
        // Create a form that displays user and accept button
        let acceptForm = document.createElement('form');
        acceptForm.action=`${api}/friends/accept`;
        acceptForm.method = "POST";
        {
          let input = document.createElement('input');
          input.type = "text";
          input.name = "username";
          input.value = friend;
          input.readonly = true;
          acceptForm.appendChild(input);
        } {
          let submit = document.createElement('input');
          submit.type = "submit";
          submit.value = "Accept";
          acceptForm.appendChild(submit);
        }

        let listitem = document.createElement('li');
        listitem.appendChild(acceptForm);

        ul.appendChild(listitem);
      }
    }).catch(err => {console.log("Error!", err); display.textContent = "" + err; return;});
}

// Cannot bind event javascript in inline javascript (<button onclick="...javascript..."></button>)
// See: Content Security Policy:
// https://stackoverflow.com/questions/13591983/onclick-or-inline-script-isnt-working-in-extension
document.getElementById("auth-button").onclick = checkAuth;
document.getElementById("get-friends").onclick = getFriends;
document.getElementById("get-invites").onclick = getInvites;

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
})
