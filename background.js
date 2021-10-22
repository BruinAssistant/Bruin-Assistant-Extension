
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    if (request.action == "xhttp") {
      const xhttp = new XMLHttpRequest();
      const method = request.method ? request.method.toUpperCase() : "GET";
  
      xhttp.onload = function() {
        callback(xhttp.responseText);
      };
      xhttp.onerror = function() {
        // Do whatever you want on error. Don't forget to invoke the
        // callback to clean up the communication port.
        callback("error");
      };
      xhttp.open(method, request.url, true);
      if (method == "POST") {
        xhttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
      }
      xhttp.send(request.data);
      return true; // prevents the callback from being called too early on returnlled too early on return
    }
  });
  