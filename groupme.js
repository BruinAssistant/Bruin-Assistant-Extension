// responds to classes in classplan

let timeout = null

populateGroupMeLinks();

document.addEventListener(
    'DOMSubtreeModified',
    () => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(listener, 1000)
    },
    false
)

// this is called whenever DOM is modifies
function listener() {
    // run the script if it detects a class search page
    // console.log("something happend");
    const windowURL = `${window.location.href}`
    if (windowURL.includes('be.my.ucla.edu')) {
        populateGroupMeLinks();
        resizeColumnWidths();
    }
}


function populateGroupMeLinks() {
    const classes = document.getElementsByClassName('courseItem')

    for (const classSection of classes) {


        for (const section of classSection.getElementsByClassName('section-header')) {
            if (section.getElementsByTagName('a').length) {
                let sectionName = section.getElementsByTagName('a')[0];
                const btn = document.createElement('p');
                btn.innerText = "Groupme stuff";
                // section.appendChild(btn);
                let btnImg = document.createElement('img');
                btnImg.className = "groupme-btn";
                btnImg.src = chrome.runtime.getURL("assets/groupme.png");
                section.appendChild(btnImg);

            }
        }
    }
}
resizeColumnWidths();
function resizeColumnWidths() {

    for (const table of document.getElementsByClassName('coursetable')) {
        if (table.getElementsByTagName('th').length == 9) {
            table.getElementsByTagName('th')[1].style.width = "10%";
        }
    }
}