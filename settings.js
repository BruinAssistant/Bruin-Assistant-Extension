// Make a basic fetch request to determine cookie authentication
function checkAuth(evt) {
  // Label that will display result
  var label = document.getElementById('auth');
  console.log("Checking auth!");

  // This route (after middleware) basically just returns if req.isAuthenticated()
  fetch('http://molasses.home.kg:65529/protected-route')
    .then(res => res.text())
    .then(res => label.textContent = res)
    .catch(err => {console.log("Error!", err); label.textContent = "" + err; return;});
}

// Cannot bind event javascript in inline javascript (<button onclick="...javascript..."></button>)
// See: Content Security Policy:
// https://stackoverflow.com/questions/13591983/onclick-or-inline-script-isnt-working-in-extension
document.getElementById("auth-button").onclick = checkAuth;
