// responds to classes in classplan

let timeout = null
const backendurl = "https://class-planner-assistant.herokuapp.com";

populateGroupMeLinks();
resizeColumnWidths();

const config = { subtree: true, childList: true };

// this is called whenever DOM is modifies
function listener(mutationsList, observer) {
    // run the script if it detects a class search page
    console.log(mutationsList);
    const windowURL = `${window.location.href}`
    if (windowURL.includes('be.my.ucla.edu')) {
        populateGroupMeLinks();
        resizeColumnWidths();
        // findClassInst();
    }
}
const observer = new MutationObserver((mutationsList, observer) => {
    let trigger = false;
    for (const mutation of mutationsList) {
        if ((mutation.target.className !== "section-header") 
        && (mutation.target.className != 'courseItem')
        ){
            trigger = true;
            break;
        }
    }
    if (trigger) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            listener(mutationsList, observer);
        }, 1000);
    }
});
// before: observing the entire doc, but change to observe only class section-header
// because other program also manipulates document
observer.observe(document, config);

function populateGroupMeLinks() {
    const classes = document.getElementsByClassName('courseItem')

    for (const classSection of classes) {
        let classNameText = classSection.getElementsByClassName('SubjectAreaName_ClassName')[0].getElementsByTagName('p')[1].innerText;

        for (const section of classSection.getElementsByClassName('section-header')) {
            if (section.getElementsByTagName('a').length) {
                let sectionName = section.getElementsByTagName('a')[0];
                const sectionIDMatchResults = sectionName.title.match(/Class Detail for ([0-9]+)/i);
                let sectionNameText = sectionName.innerText;
                if (sectionIDMatchResults.length < 2) {
                    console.error("Cannot find section ID for " + sectionName.title);
                }
                const sectionID = sectionIDMatchResults[1];
                const btn = document.createElement('a');
                getGroupmeLink(sectionID, classNameText, sectionNameText, (groupmeLink) => {
                    let prev = section.getElementsByClassName("groupme-btn");
                    if (prev.length > 0) {
                        prev[0].remove();
                    }
                    btn.className = "groupme-btn";
                    btn.target = "_blank";
                    btn.rel = "noopener noreferrer";
                    btn.href = groupmeLink;
                    let btnImg = document.createElement('img');
                    btnImg.src = chrome.runtime.getURL("assets/groupme.png");
                    btn.appendChild(btnImg);
                    section.appendChild(btn);
                });
            }
        }
    }
}

function getGroupmeLink(sectionID, classNameText, sectionNameText, handler) {
    console.log("Sending message" + JSON.stringify({
        sectionID: sectionID,
        className: classNameText,
        sectionName: sectionNameText
    }));

    chrome.runtime.sendMessage({
        contentScriptQuery: "postData",
        data: JSON.stringify({
            sectionID: sectionID,
            className: classNameText,
            sectionName: sectionNameText
        }),
        url: backendurl + "/groupme"
    }, function (response) {
        console.log(response)
        if (response != undefined && response != "") {
            handler(response);
            // btn.href = response;
        }
    });
}

// Change the column width of the course table to make things look better
function resizeColumnWidths() {

    for (const table of document.getElementsByClassName('coursetable')) {
        if (table.getElementsByTagName('th').length >= 2) {
            table.getElementsByTagName('th')[1].style.width = "10%";
        }
    }
}