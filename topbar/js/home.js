

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
