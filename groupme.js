/**
 * @file A content script that handles the injection of GroupMe invite links for classes at UCLA. 
 */
const backendurl = "https://class-planner-assistant.herokuapp.com";

populateGroupMeLinks();
resizeColumnWidths();

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
        }
    });
}

// Change the column width of the course table to make things look better
function resizeColumnWidths() {

    for (const table of document.getElementsByClassName('coursetable')) {
        if (table.getElementsByTagName('th').length >= 6) {
            table.getElementsByTagName('th')[1].style.width = "8%"; // Section
            table.getElementsByTagName('th')[5].style.width = "13%"; // Time
        }
    }
}