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
    console.log("Mutation:", mutation);

    // for (let bwalkBtn of document.getElementsByClassName("hide-small")) {
    //     if (bwalkBtn.contains(mutation.target)) {
    //         return;
    //     }
    // }

    // for (let node of mutation.addedNodes) {
    //     if (!injectionClassNames.includes(node.className)) {
    //         console.log("Mutation: ", mutation);
    //         callback();
    //         return;
    //     }
    // }
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
        // This is kind of a hack.
        // Check if the body changed className to 'ajax-none iweResponsive'
        // If so we can presume the page has reloaded.
        if (mutation.target.classList.length === 2) {
            repopulate();
            break;
        }
    }
});

// const config = { subtree: true, childList: true };
const config = { attributes: true };

// Attaches the MutationObserver onto the 
observer.observe(document.getElementsByTagName('body')[0], config);

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
function repopulate() {
    // run the script if it detects a class search page
    // Need to remove previous injections to avoid duplicates
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        console.log("Re-injecting Bruin Assistant...")
        removePrevInjections();
        const windowURL = `${window.location.href}`
        if (windowURL.includes('be.my.ucla.edu')) {
            populateGroupMeLinks();
            initiateTimeDistance();
            resizeColumnWidths();
            findClassInst();
        }
    }, 500);
}

repopulate();

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
    console.log("Removing previous injections...");
    for (const className of injectionClassNames) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) elements[0].remove();
    }
}

function removeElementsWithClassName(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) elements[0].remove();
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
        let ths = table.getElementsByTagName('th')
        if (ths.length >= 6) {
            ths[1].style.width = "8%"; // Section
            ths[6].style.width = "13%"; // Time
        }
    }
}


class Injection {
    constructor(className) {
        this.className = className;
    }

    remove() {
        const elements = document.getElementsByClassName(this.className);
        while (elements.length > 0) elements[0].remove();
    }

    inject() {
        console.error("Need to override inject()");
    }
}