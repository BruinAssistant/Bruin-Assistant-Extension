let timeout = null

const observer = new MutationObserver((mutationsList, observer) => {
    let trigger = false;
    for (const mutation of mutationsList) {
        if (!observerWhiteList.includes(mutation.target.className)) {
            trigger = true;
            console.log(mutation.target.className);
            break;
        }
    }
    if (trigger) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            repopulate();
        }, 1000);
    }
});
// DOM Nodes that should not trigger mutation callback for reload.
const observerWhiteList = [
    "inst-rating-title-div",
    "inst-rating-content-div",
    "hide-small",
    "section-header",
    "inst-rating-footer-div",

    "instructor-container",
    "instructorColumn hide-small",
    "bwalk-popup-title-div",
    "metricTable",
    "row-fluid class-title",
    "", // <-- what to do with this....
    "bruinwalk-btn","popup","bruinwalk-normal"

    // ************* work on "primarySection hide" ***********
];
const injectionClassNames = ["bruinwalk-btn"];

function removePrevInjections() {
    console.log("Removing previous injections...");
    for (const className of injectionClassNames) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) elements[0].remove();
    }
}

function repopulate(){
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        removePrevInjections();
        const windowURL = `${window.location.href}`
        if(windowURL.includes('sa.ucla.edu')){
            console.log("Re-injecting Bruin Assistant...")
            findSAClassSearchInstructor();
        }
    }, 500);
}



const config = { subtree: true, childList: true };

// observer.observe(document.getElementsByTagName('body')[0], config);
observer.observe(document.getElementsByTagName('ucla-sa-soc-app')[0].shadowRoot.getElementById('resultsTitle'), config);

function findSAClassSearchInstructor(){
    let resultsTable = document.getElementsByTagName('ucla-sa-soc-app')[0].shadowRoot.getElementById('resultsTitle');
    let courseMajor = document.getElementsByTagName('ucla-sa-soc-app')[0].shadowRoot.getElementById('spanSearchResultsHeader').innerText.match(/\(([^)]+)\)/)[1].replace(/\s+/g, '-').toLowerCase();
    
    /*
    let uclaClasses = resultsTable.getElementsByClassName('row-fluid class-title');
    for (let i = 0; i < uclaClasses.length; i++){ // iterate ucla classes 19 times
        let title = uclaClasses[i].innerText;
        let courseNum = title.split(" - ")[0].toLowerCase();
        let fullCourseName = courseMajor + '-' + courseNum;

        console.log(resultsTable.getElementsByClassName('instructorColumn hide-small'));
    }
    */
    // console.log(resultsTable);
    // console.log(resultsTable.getElementsByClassName('instructorColumn hide-small')[0].closest('.row-fluid.class-title'));
    let instructorDivs = resultsTable.getElementsByClassName('instructorColumn hide-small');
    
    // start at 1 to skip header row
    for (let i = 1; i < instructorDivs.length; i++){
        let instDiv = instructorDivs[i];
        
        let courseNum = instDiv.closest('.row-fluid.class-title').innerText.split(" - ")[0].toLowerCase();
        let fullCourseName = courseMajor + '-' + courseNum;

        transformedDiv = transformInstDiv(instDiv);

        // INJECT INSTRUCTOR-CONTAINER CLASS BUT CAUSES MUTATION OBSERVER TO RELOAD

        for (let profNameDiv of transformedDiv.getElementsByClassName('instructor-container')){
            
            getSearchResult(fullCourseName, profNameDiv.innerText, ((instUrl) => {
                if (instUrl == ""){
                    showPopup("", profNameDiv, "")
                }
                else{
                    chrome.runtime.sendMessage({
                        url: instUrl,
                        contentScriptQuery: "getBruinwalkData",
                    }, responseHTMLString => {
                        let responseHTML = stringToHTML(responseHTMLString);

                        showPopup(instUrl, profNameDiv, responseHTML, i);
                    });
                }
            }))
            
        }
        
    }

    /*
    let instName = res.sections[0].instructor;
    let courseMajor = res['course-title-0'].split(": ")[1];
    let courseNum = res['course-title-1'].split(" - ")[0];
    let fullCourseName = classDict[courseMajor] + '-' + courseNum;

    transformedDiv = transformInstDiv(courseItem.getElementsByTagName("tbody")[1].getElementsByClassName("hide-small")[1]);

    // iterate through each newly transformed div to create button and div
    for (let profNameDiv of transformedDiv.getElementsByClassName('instructor-container')){
        getSearchResult(fullCourseName, profNameDiv.innerText, ((instUrl) => {
            if (instUrl == ""){
                showPopup("", profNameDiv, "")
            }
            else{
                chrome.runtime.sendMessage({
                    url: instUrl,
                    contentScriptQuery: "getBruinwalkData",
                }, responseHTMLString => {
                    let responseHTML = stringToHTML(responseHTMLString);
                    showPopup(instUrl, profNameDiv, responseHTML);
                });
            }
        }))
    }*/
}
