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

function validateUCLAEmail(email) {
  var re = /^[^\s@]+@g.ucla.edu/;
  return re.test(email);
}

// Make a basic fetch request to determine cookie authentication
function checkAuth(evt) {
  // Label that will display result
  console.log("Checking auth!");

  // This route (after middleware) basically just returns if req.isAuthenticated()
  // https://class-planner-assistant-dev.herokuapp.com/protected-route
  fetch(`${api}/authenticated`)
    .then(res => res.json())
    .then(res => {
      display.textContent = res.msg;
      if (res.code === 0) {
        // document.getElementById("register-form").classList.remove("show");
        // document.getElementById("login-form").classList.add("show");
        document.getElementById("login-form").classList.remove("show");
      }
    })
    .catch(err => {
      console.log("Error!", err);
      display.textContent = "" + err;
      return;
    });
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
    }).catch(err => {
      console.log("Error!", err);
      display.textContent = "" + err;
      return;
    });
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
        acceptForm.action = `${api}/friends/accept`;
        acceptForm.method = "POST"; {
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
    }).catch(err => {
      console.log("Error!", err);
      display.textContent = "" + err;
      return;
    });
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

document.forms['register-form'].addEventListener('submit', (event) => {
  event.preventDefault();
  let formdata = new FormData(event.target);
  alert(event.target)
  alert(new URLSearchParams(formdata).toString());
  if (!validateUCLAEmail(formdata.get('email'))) {
    alert("Please enter an email ending in '@g.ucla.edu'", formdata['email']);
    return;
  }
  if (formdata.get('username').length < 6) {
    alert("Please enter a username with a minimum of 6 characters");
    return;
  }

  if (!StrengthChecker(formdata.get('password'))) {
    alert("Please use a password that is has medium strength");
    return;
  }

  alert("An email confirmation will be sent to you.");

  fetch(event.target.action, {
    method: 'POST',
    body: new URLSearchParams(formdata) // event.target is the form
  }).then((resp) => {
    return resp.json(); // or resp.text() or whatever the server sends
  }).then((body) => {
    if (body.code) {
      // Error code returned 
      alert(body.msg);
    } else {
      checkAuth();
    }
  }).catch((error) => {
    console.error(error);
  });
});

// timeout before a callback is called

let timeout;

// traversing the DOM and getting the input and span using their IDs

let password = document.getElementById('password-input')
let strengthBadge = document.getElementById('StrengthDisp')

// The strong and weak password Regex pattern checker

let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

function StrengthChecker(PasswordParameter) {
  // We then change the badge's color and text based on the password strength
    console.log("password:", PasswordParameter);
  if (strongPassword.test(PasswordParameter)) {
    strengthBadge.style.backgroundColor = "green"
    strengthBadge.textContent = 'Strong'
    return true;
  } else if (mediumPassword.test(PasswordParameter)) {
    strengthBadge.style.backgroundColor = 'blue'
    strengthBadge.textContent = 'Medium'
    return true;
  } else {
    strengthBadge.style.backgroundColor = 'red'
    strengthBadge.textContent = 'Weak'
    return false;
  }
}

// Adding an input event listener when a user types to the  password input 

password.addEventListener("input", () => {

  //The badge is hidden by default, so we show it

  strengthBadge.style.display = 'block'
  clearTimeout(timeout);

  //We then call the StrengChecker function as a callback then pass the typed password to it

  timeout = setTimeout(() => StrengthChecker(password.value), 500);

  //Incase a user clears the text, the badge is hidden again

  if (password.value.length !== 0) {
    strengthBadge.style.display != 'block'
  } else {
    strengthBadge.style.display = 'none'
  }
});