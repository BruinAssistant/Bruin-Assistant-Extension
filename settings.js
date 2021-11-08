// Make a basic fetch request to determine cookie authentication
function checkAuth(evt) {
  // Label that will display result
  var label = document.getElementById('auth');
  console.log("Checking auth!");

  // This route (after middleware) basically just returns if req.isAuthenticated()
  fetch('https://class-planner-assistant-dev.herokuapp.com/protected-route')
    .then(res => res.json())
    .then(res => { 
      label.textContent = res.msg;
      if (res.code === 1) {
        document.getElementsByTagName("form")[0].classList.add("show");
      }
    })
    .catch(err => {console.log("Error!", err); label.textContent = "" + err; return;});
}

// Cannot bind event javascript in inline javascript (<button onclick="...javascript..."></button>)
// See: Content Security Policy:
// https://stackoverflow.com/questions/13591983/onclick-or-inline-script-isnt-working-in-extension
document.getElementById("auth-button").onclick = checkAuth;

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
})
