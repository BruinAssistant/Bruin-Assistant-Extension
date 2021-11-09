
var api = "https://class-planner-assistant-dev.herokuapp.com/api";
var display = document.getElementById('display');

// Make a basic fetch request to determine cookie authentication
function checkAuth(evt) {
  // Label that will display result
  console.log("Checking auth!");

  // This route (after middleware) basically just returns if req.isAuthenticated()
  fetch(`${api}/authenticated`)
    .then(res => res.json())
    .then(res => {
      display.textContent = res.msg;
      if (res.code === 1) {
        document.getElementsByTagName("form")[0].classList.add("show");
      }
    })
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