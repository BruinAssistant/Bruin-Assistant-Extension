
function replace_form_submission(form, cb) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let formdata = new FormData(event.target);
    fetch(event.target.action, {
      method: 'POST',
      body: new URLSearchParams(formdata) // event.target is the form
    }).then((resp) => {
      return resp.json(); // or resp.text() or whatever the server sends
    }).then((body) => {
      return cb(body);
    }).catch((error) => {
      console.error(error);
      return cb({code: 1, msg: "" + error});
    });
  })
}

var display = document.getElementById('display');

let invite_form = document.forms['invite-form'];

// If the action is a relative path, attach it to the BACKEND_URL
let replace_backend_url = invite_form.action.indexOf("BACKEND_URL");
if (0 < replace_backend_url) {
  let path = invite_form.action.substr(replace_backend_url + "BACKEND_URL".length);
  invite_form.action = BACKEND_URL + path;
}

replace_form_submission(invite_form, (body) => {
  if (body.code) {
    alert("Fail! :( " + body.msg);
  } else {
    let username_input = document.getElementById('username-input');
    alert("Successfully added friend: " + username_input.value);
    username_input.value = "";
  }
});

function getFriends(evt) {
  var ul = document.getElementById('friends-display');
  fetch(`${BACKEND_URL}./api/friends/list`)
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
  fetch(`${BACKEND_URL}./api/friends/pending`)
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
        let listitem = document.createElement('li');
        let acceptForm = document.createElement('form');
        acceptForm.action = `${BACKEND_URL}./api/friends/accept`;
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
        replace_form_submission(acceptForm, (body) => {
          if (body.code) {
            console.log("Failed to accept friend request!");
            alert("Error! " + body.msg);
            getInvites();
          } else {
            console.log("Succesfully accepted friend request!");
            alert("Accepted Friend Request!");
            listitem.remove();
            getFriends();
          }
        });

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
document.getElementById("get-friends").onclick = getFriends;
document.getElementById("get-invites").onclick = getInvites;

getFriends();
getInvites();
