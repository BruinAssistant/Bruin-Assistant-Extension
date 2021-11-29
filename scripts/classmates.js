/**
 * @file This content script reports which of a user's friends are in each class
 *
 * @author Henry Loh (Bubba7400)
 */

function createDOM(classmates, countFirst) {
    if (countFirst === undefined)
      countFirst = false;

    let ele = document.createElement('span');
    if (classmates.length == 0)
      ele.title = "No known classmates";
    else if (classmates.length == 1)
      ele.title = classmates[0] + " is taking this class!";
    else
      ele.title = "You have " + classmates.length + " friends taking this class:\n" + classmates.join(", ");
    ele.classList = ["classmates"];

    let count = document.createElement("label");
    count.innerText = "" + classmates.length;
    count.style = "display: inline-block;";

    let icon = document.createElement("i");
    // icon.style = "padding-right:.5em; display:block; float:left; height:2em;";
    icon.classList = ["icon-user"];

    if (countFirst) {
      icon.style = "display:inline-block; height:2em; margin-left: 0.5em; margin-right: 1.0em;";
      ele.appendChild(count);
      ele.appendChild(icon);
    } else {
      icon.style = "display:inline-block; height:2em; margin-left: 1.0em; margin-right: 0.5em;";
      ele.appendChild(icon);
      ele.appendChild(count);
    }

    return ele;
}

// Query for the course with the given id and inject response into ele
function queryAndInject(id, dom) {
  // Skip previous injections
  if (dom.classList.contains("classmates_marked")) {
      console.log("Already updated this DOM element for course: " + id);
      return;
  }
  chrome.runtime.sendMessage({
      contentScriptQuery: "getdata",
      url: BACKEND_URL + "./api/schedule/classmates?course=" + id
  }, function (response) {
      // console.log(response)
      if (response != undefined && response != "") {
          if (dom.classList.contains("classmates_marked")) {
              console.log("Already updated this DOM element for course: " + id);
              return;
          }

          console.log("Classmates for " + id + ": ", response);
          let data = JSON.parse(response).msg;
          console.log(data);
          let enrolled = data["" + id].enrolled;
          let planned  = data["" + id].planned;
          let classmates = [...enrolled, ...planned];
          let ele = createDOM(classmates);
          dom.appendChild(document.createElement('br'));
          dom.appendChild(ele);
          dom.classList.add("classmates_marked");
      }
  });
}

// Called on DOM change by observer.js
function showClassmates() {
    console.log("Displaying classmates!");

    updateClassPlanner();
    updateAddClassToPlan();
}

function updateAddClassToPlan() {
    function trackChanges(parent) {
        function callback (list, observer) {
            console.log("Got some changes!");
            let update = false;
            for (const mutation of list) {
                if (mutation.type === 'childList') {
                    update = true;
                }
            }
            if (update) {
              setTimeout(() => {
                for (const row of document.getElementsByClassName("data_row")) {
                  console.log("Updating Row:", row);
                  updateDataRow(row);
                }
              }, 1000);
            }
        }

      // Listen for future changes and update those too
      console.log("Listening to " + parent + " for changes.");
      let observer = new MutationObserver(callback);
      observer.observe(parent, {childList: true});
    }

    function updateDataRow(data_row) {
        let row_id = data_row.id.match(/_([0-9]+)$/i);
        if (row_id == null) return;
        console.log("Updating " + data_row + " with section ID: " + row_id[1]);

        // Inject icon into this row
        let id = parseInt(row_id[1]);
        queryAndInject(id, data_row.getElementsByClassName("span3")[0]);
    }

    let data_rows = document.getElementsByClassName("data_row");
    for (const data_row of data_rows) {
        let row_id = data_row.id.match(/data_course_[^_]*_([0-9]+)$/i);
        if (row_id == null) continue;

        updateDataRow(data_row);
        trackChanges(data_row.parentElement);
    }
}

function updateClassPlanner() {
    let DOMcourses = document.getElementsByClassName("courseItem");

    // Parse all available courses from class planner / study list
    for (const DOMcourse of DOMcourses) {
        parseCourseItem(DOMcourse, {
            'forEachSection' : (res, sec, body) => {
                console.log("Parsed Section: " + JSON.stringify(sec));
                let id = parseInt(sec.id);
                let td_status = body.getElementsByClassName('section-header').item(0).nextElementSibling;
                console.log("Injecting classmates into: ", td_status);

                queryAndInject(id, td_status);
            }
        });
    }
}
