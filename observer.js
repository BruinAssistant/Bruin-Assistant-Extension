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

const injectionClassNames = ["th-timedistance", "td-timedistance", "qr-popup", "bruinwalk-btn"]

/**
 * Checks whether the mutation is caused by extension injection, if so then do
 * not reload. If this is not prevented, we'll have an infinite loop of reloads.
 * 
 * @function 
 * 
 * @param {MutationRecord} mutation 
 * @param {*} callback 
 * @returns {void}
 */
function validMutation(mutation, callback) {

    // TODO: Use unique className
    for (let bwalkBtn of document.getElementsByClassName("hide-small")) {
        if (bwalkBtn.contains(mutation.target)) {
            return;
        }
    }

    for (let node of mutation.addedNodes) {
        if (!injectionClassNames.includes(node.className)) {
            console.log("Mutation: ", mutation);
            callback();
            return;
        }
    }
}

/**
 * Creates a mutation observers that listens for DOM mutations. 
 * 
 * @global 
 * @constant {MutationObserver}
 * @readonly
 */

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

// Attaches the MutationObserver onto the 
observer.observe(document, config);

/**
 * This is the callback for Mutation Observer that listens on class planner 
 * changes in the DOM.
 * 
 * @function 
 * 
 * @param {*} mutationsList 
 * @param {*} observer 
 * 
 * @returns {void}
 */
// 
function repopulate(mutationsList, observer) {
    // run the script if it detects a class search page
    // Need to remove previous injections to avoid duplicates
    removePrevInjections();
    const windowURL = `${window.location.href}`
    if (windowURL.includes('be.my.ucla.edu')) {
        populateGroupMeLinks();
        resizeColumnWidths();
        initiateTimeDistance();
        findClassInst();
    }
}

/**
 * Removes previous injections to prepare to repopulate injections.
 * 
 * @function
 * @returns {void}
 * 
 * @see {@link injectionClassNames} for removing previous injections.
 * @see {@link repopulate} to find use case.
 */
function removePrevInjections() {
    for (const className of injectionClassNames) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) elements[0].remove();
    }
}

/**
 * Resize the column width of the course table to make things look nicer.
 * 
 * This function is invoked whenever the extension injections happen.
 * 
 * @function
 * @returns {void}
 */
function resizeColumnWidths() {

    for (const table of document.getElementsByClassName('coursetable')) {
        if (table.getElementsByTagName('th').length >= 6) {
            table.getElementsByTagName('th')[1].style.width = "8%"; // Section
            table.getElementsByTagName('th')[5].style.width = "13%"; // Time
        }
    }
}