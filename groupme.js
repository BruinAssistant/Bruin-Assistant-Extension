// responds to classes in classplan

let timeout = null
const backendurl = "https://class-planner-assistant.herokuapp.com";

populateGroupMeLinks();
resizeColumnWidths();

const config = { subtree: true, childList: true };

// this is called whenever DOM is modifies
function listener(mutationsList, observer) {
    // run the script if it detects a class search page
    const windowURL = `${window.location.href}`
    if (windowURL.includes('be.my.ucla.edu')) {
        populateGroupMeLinks();
        resizeColumnWidths();
    }
}

// DOM Nodes that should not trigger mutation callback for reload.
const observerWhiteList = [
    "inst-rating-title-div",
    "inst-rating-content-div",
    "hide-small",
    "section-header",
    "inst-rating-footer-div",
];

const observer = new MutationObserver((mutationsList, observer) => {
    let trigger = false;
    for (const mutation of mutationsList) {
        if (!observerWhiteList.includes(mutation.target.className)) {
            trigger = true;
            console.log("Mutation: ", mutation);
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
                getGroupmeLink(sectionID, classNameText, sectionNameText, (groupmeLink) => {
                    for (let node of section.getElementsByClassName("qr-popup")) {
                        node.remove();
                    }

                    let QRSpan = document.createElement('span');
                    QRSpan.className = "qr-popuptext";
                    let QR = document.createElement('img');
                    QR.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + groupmeLink;
                    QR.className = "qr-img"
                    QRSpan.appendChild(QR);

                    let QRPopup = document.createElement('a');
                    QRPopup.target = "_blank";
                    QRPopup.rel = "noopener noreferrer";
                    QRPopup.href = groupmeLink;
                    
                    QRPopup.className = "qr-popup"

                    let btnImg = document.createElement('img');
                    btnImg.src = chrome.runtime.getURL("assets/groupme.png");
                    btnImg.className = "groupme-img"

                    QRPopup.appendChild(btnImg);
                    QRPopup.appendChild(QRSpan);
                    section.appendChild(QRPopup);
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
            table.getElementsByTagName('th')[1].style.width = "8%";
        }
    }
}