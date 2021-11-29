
const BACKEND_URL = "https://class-planner-assistant.herokuapp.com/";



let user_a = {
  "username" : "Alice",
  "email" : "alice_loves_testing@g.ucla.edu",
  "password" : "Alice_loves_testing_123"
};

let url = BACKEND_URL + "./register";
fetch(url, {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    body: user_a
})
.then(res => res.text())
.then(res => console.log("Successfully Registered! " + res))
.catch(res => console.log("Error trying to register: " + res));

// fetch(url)
//     .then(response => response.text())
//     .then(response => sendResponse(response))
//     .catch(err => console.log("Error in getdata request: ", err));
// return true;
