
let login_form = document.forms['login-form'];

// If the action is a relative path, attach it to the BACKEND_URL
let replace_backend_url = login_form.action.indexOf("BACKEND_URL");
if (0 < replace_backend_url) {
  let path = login_form.action.substr(replace_backend_url + "BACKEND_URL".length);
  login_form.action = BACKEND_URL + path;
}

login_form.addEventListener('submit', (event) => {
  event.preventDefault();

  let formdata = new FormData(event.target);
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
      alert("Successfully Authenticated!");
      // Redirect to the login page
      location.href = "../html/portal.html";
    }
  }).catch((error) => {
    console.error(error);
  });
});


// Make a basic fetch request to determine cookie authentication
function checkAuth(evt) {
  // Label that will display result
  console.log("Checking auth!");

  // This route (after middleware) basically just returns if req.isAuthenticated()
  // https://class-planner-assistant-dev.herokuapp.com/protected-route
  fetch(`${BACKEND_URL}./api/authenticated`)
    .then(res => res.json())
    .then(res => {
      // alert("Response: " + res.msg);
      // display.textContent = res.msg;
      if (res.code === 0) {
        console.log("Changing window.location.href from " + window.location.href + " to /topbar/html/portal.html");
        window.location.href = "/topbar/html/portal.html";
        // document.getElementById("register-form").classList.remove("show");
        // document.getElementById("login-form").classList.add("show");
        // document.getElementById("login-form").classList.remove("show");
      }
    })
    .catch(err => {
      console.log("Error!", err);
      alert(err);
      // display.textContent = "" + err;
      return;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
})
