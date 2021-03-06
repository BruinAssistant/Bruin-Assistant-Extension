/**
 * @file A content script that handles the injection of GroupMe invite links for
 * classes at UCLA. 
 * 
 * @author Johnson Zhou (Clumsyndicate)
 */

// // Inject on start-up
// populateGroupMeLinks();
// resizeColumnWidths();

/**
 * Inject GroupMe add-on related DOM elements into the content page.
 * 
 * This function iterates over all courses, requests for GroupMe invite links, 
 * and populates the page asynchronously.
 * 
 * Any fetch calls can be only made in background.js. Therefore a message is
 * sent to background.js to make the cross-domain request.
 * 
 * @function
 * @returns {void}
 */

function populateForSection(sectionID, className, sectionName, sectionDOM) {
    getGroupmeLink(sectionID, className, sectionName, (groupmeLink) => {
        for (let node of sectionDOM.getElementsByClassName("qr-popup")) {
            node.remove();
        }

        let QRSpan = document.createElement('span');
        QRSpan.className = "qr-popuptext";
        let QR = document.createElement('img');
        QR.src = QR_API_URL + groupmeLink;
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
        sectionDOM.appendChild(QRPopup);
    });
}

/**
 * Callback for getting GroupMe links
 * 
 * @callback getGroupmeLinkCallback
 * @param {String} response 
 */

/**
 * Sends a message to the background.js worklet to let it perform a fetch on 
 * behalf of the content script. 
 * 
 * @param {String} sectionID 
 * @param {String} classNameText 
 * @param {String} sectionNameText 
 * @param {getGroupmeLinkCallback} handler 
 */

function getGroupmeLink(sectionID, classNameText, sectionNameText, handler) {
    // console.log("Sending message" + JSON.stringify({
    //     sectionID: sectionID,
    //     className: classNameText,
    //     sectionName: sectionNameText
    // }));

    chrome.runtime.sendMessage({
        contentScriptQuery: "postData",
        data: JSON.stringify({
            sectionID: sectionID,
            className: classNameText,
            sectionName: sectionNameText
        }),
        url: BACKEND_URL + "groupme"
    }, function (response) {
        // console.log(response)
        if (response != undefined && response != "") {
            handler(response);
        }
    });
}
