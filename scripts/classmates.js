/**
 * @file This content script reports which of a user's friends are in each class
 *
 * @author Henry Loh (Bubba7400)
 */

function createDOM(classmates) {
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
    icon.style = "display:inline-block; height:2em; margin-left: 1em; margin-right: 0.5em;";
    icon.classList = ["icon-user"];

    ele.appendChild(icon);
    ele.appendChild(count);

    return ele;
}

// Called on DOM change by observer.js
function showClassmates() {
    console.log("Syncing course schedule!");

    let DOMcourses = document.getElementsByClassName("courseItem");

    // Parse all available courses from class planner / study list
    for (const DOMcourse of DOMcourses) {
        parseCourseItem(DOMcourse, {
            'forEachSection' : (res, sec, body) => {
                console.log("Parsed Section: " + JSON.stringify(sec));
                let id = parseInt(sec.id);
                let td_status = body.getElementsByClassName('section-header').item(0).nextElementSibling;
                console.log("Injecting classmates into: ", td_status);

                chrome.runtime.sendMessage({
                    contentScriptQuery: "getdata",
                    url: BACKEND_URL + "./api/schedule/classmates?course=" + id
                }, function (response) {
                    // console.log(response)
                    if (response != undefined && response != "") {
                        console.log("Classmates for " + id + ": ", response);

                        let data = JSON.parse(response).msg;
                        console.log(data);
                        let enrolled = data["" + id].enrolled;
                        let planned  = data["" + id].planned;
                        let classmates = [...enrolled, ...planned];
                        let ele = createDOM(classmates);
                        td_status.appendChild(ele);
                    }
                });
            }
        });
    }
}
