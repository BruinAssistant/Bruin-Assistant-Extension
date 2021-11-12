/**
 * @file This file uses a MutationObserver to automatically refresh the 
 * extension to remove old content and inject new DOM elements.
 * 
 * @author Johnson Zhou (Clumsyndicate)
 */


let timeout = null

// DOM Nodes that should not trigger mutation callback for reload.
const observerWhiteListClassName = [
    "inst-rating-title-div",
    "inst-rating-content-div",
    "hide-small",
    "section-header",
    "inst-rating-footer-div",
];

const injectionClassNames = ["th-timedistance", "td-timedistance", "qr-popup"];

function validMutation(mutation, callback) {
    for (let node of mutation.addedNodes) {
        if (!injectionClassNames.includes(node.className)) {
            console.log("Mutation: ", mutation);
            callback();
            return;
        }
    }
}

const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (validMutation(mutation, () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                repopulate(mutationsList, observer);
            }, 1000);
        })) {
            break;
        }
    }
});

const config = { subtree: true, childList: true };

observer.observe(document.getElementsByClassName("classPlanner_ClassesInPlanSection")[0], config);

// this is called whenever DOM is modifies
function repopulate(mutationsList, observer) {
    // run the script if it detects a class search page
    // Need to remove previous injections to avoid duplicates
    removePrevInjections();
    const windowURL = `${window.location.href}`
    if (windowURL.includes('be.my.ucla.edu')) {
        populateGroupMeLinks();
        resizeColumnWidths();
        initiateTimeDistance();
    }
}

function removePrevInjections() {
    for (const className of injectionClassNames) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) elements[0].remove();
    }
}