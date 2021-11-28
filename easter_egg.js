/**
 * @file A content script dedicated to performing our easter egg-functionality.
 * This easter egg is top-secret :) If you're curious on what it does, perhaps
 * you should explore around with the extension a bit! :D
 * 
 * @author Harrison Cassar (harrisonCassar)
 */

/**
 * Specifies our amazing Professor of CS130 for use while parsing. :)
 * 
 * @global
 * @constant {String}
 * @readonly
 */
const best_professor = "Kim, M.";

/**
 * Specifies our amazing TA of CS130 for use while parsing. :)
 * 
 * @global
 * @constant {String}
 * @readonly
 */
const best_ta = "Xiao, P.";

/**
 * Initiates check for "Mystery Mode", which enables easter-egg injection.
 * This injection is performed by calling helper function `injectEasterEgg()`.
 * 
 * @return void
 * 
 * @see {@link injectEasterEgg} for helper injection function.
 */
 function initiateEasterEgg() {

    // check if we're in "Mystery Mode"
    chrome.storage.sync.get("mystery_mode", ({ mystery_mode }) => {
    
        if (mystery_mode) { // perform easter egg injection
            console.log("Peforming EASTER EGG... (mystery mode ENABLED)");
            injectEasterEgg();
        }
        else { // don't perform easter egg injection :(
            console.log("No easter egg :c (mystery mode DISABLED)");
        }
    })
 }

 /**
 * Performs direct injection of easter egg information into user's Class Plan.
 * 
 * @return void
 */
 function injectEasterEgg() {

    // get courses
    let courses = document.getElementById("div_landing").getElementsByClassName("courseItem");

    // iterate through each course
    for (let course of courses) {

        // get course table (holds header row, as well as all section rows)
        let course_table = course.getElementsByClassName('coursetable').item(0).getElementsByTagName('tbody');

        // iterate through sections to inject all relevant class time/dist info
        for (let i = 1; i < course_table.length; i++) {

            // determine which section we're currently injecting for
            let section = course_table.item(i);

            let instr_name = null;

            let instr_name_list = section.firstElementChild.getElementsByClassName('instructor-name');
            if (instr_name_list.length > 0)
                instr_name = instr_name_list[0].innerHTML;
            else
                instr_name = section.firstElementChild.getElementsByClassName('hide-small')[1].innerHTML;

            if (instr_name == best_professor)
            {
                section.firstElementChild.getElementsByClassName('instructor-name')[0].innerHTML = instr_name + "\n(Best Professor)";
            }
            else if (instr_name == best_ta)
            {
                section.firstElementChild.getElementsByClassName('hide-small')[1].innerHTML = instr_name + "\n(Best TA)";
            }
        }
    }
 }