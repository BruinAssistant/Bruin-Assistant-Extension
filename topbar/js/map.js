let copy_button = document.getElementById("copy-btn");
let map_id = "";
chrome.storage.local.get(['mapID'], function(result) {
    map_id = result['mapID'].id;
    console.log('Map ID currently is ' + map_id);
  });

copy_button.addEventListener("click", function () {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(map_id).then(function() {
                /* clipboard successfully set */
                console.log("Copy succeeded.")
              }, function() {
                /* clipboard write failed */
                console.log("Copy failed.")
            });
        }
      });
});