/**
 * @file This content script syncs the displayed course schedule with
 * a backend database.
 *
 * @author Henry Loh (Bubba7400)
 */


// Called from Observer whenever DOM changes
function syncSchedule() {
  console.log("Syncing course schedule!");

  let DOMcourses = document.getElementsByClassName("courseItem");
  // Set of classes in which the user is enrolled
  let enrolled = new Set();
  // Set of classes in which the user is waitlisted/planned
  let planned = new Set();

  // Parse all available courses from class planner / study list
  for (const DOMcourse of DOMcourses) {
    parseCourseItem(DOMcourse, {
      'forEachSection' : (res, sec, body) => {
        let id = parseInt(sec.id);
        if (sec.status.startsWith("Enrolled")) {
          // Enrolled: 5 of 50 Left
          enrolled.add(id);
        } else {
          // Waitlisted:
          // Open: 3 of 50 Left
          // Cancelled
          planned.add(id);
        }
      }
    });
  }

  // Package course schedule into list of enrolled/planned classes
  let body = {
    'enrolled' : Array.from(enrolled),
    'planned'  : Array.from(planned)
  };
  console.log("Course Schedule: " + JSON.stringify(body));

  // Upload to server
  chrome.runtime.sendMessage({
      contentScriptQuery: "postData",
      data: JSON.stringify(body).toString(),
      url: BACKEND_URL + "./api/schedule/sync"
  }, function (response) {
      // console.log(response)
      if (response != undefined && response != "") {
          console.log("Schedule Response: " + response);
      }
  });
}
