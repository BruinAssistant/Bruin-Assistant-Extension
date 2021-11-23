
var api = "https://class-planner-assistant-dev.herokuapp.com/api";
var display = document.getElementById('display');

function validateUCLAEmail(email) {
  var re = /^[^\s@]+@g.ucla.edu/;
  return re.test(email);
}

let register_form = document.forms['register-form'];

// If the action is a relative path, attach it to the BACKEND_URL
let replace_backend_url = register_form.action.indexOf("BACKEND_URL");
if (0 < replace_backend_url) {
  let path = register_form.action.substr(replace_backend_url + "BACKEND_URL".length);
  register_form.action = BACKEND_URL + path;
}

register_form.addEventListener('submit', (event) => {
  event.preventDefault();
  let formdata = new FormData(event.target);
  alert(JSON.stringify(event.target));
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
      alert("Successfully registered!");
      // Redirect to the login page
      location.href = "login.html";
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
