/**
 * @file This file works on fetching data from MyULCA Planner and fetch data
 * from bruinwalk.com according to student's class planner. It searches the
 * bruinwalk href of an instructor from class planner.
 * 
 * @author Nathakin "Ken" Leepreecha (KenNL42)
 */

/**
 * Dictionary with (key, value) : (full major name, abbreviate majaor name) 
 * for fetching data from bruinwalk.com since it is stored in abbreviation.
 * 
 * @global
 * @constant {Dictionary}
 * @readonly
 */
const classDict = {"Aerospace Studies": "AERO-ST","African American Studies": "AF-AMER","African Studies": "AFRC-ST","Afrikaans": "AFRKAAN","American Indian Studies": "AM-IND","American Sign Language": "ASL","Ancient Near East": "AN-N-EA","Anesthesiology": "ANES","Anthropology": "ANTHRO","Applied Linguistics": "APPLING","Arabic": "ARABIC","Archaeology": "ARCHEOL","Architecture and Urban Design": "ARCH-UD","Armenian": "ARMENIA","Art": "ART","Art History": "ART-HIS","Arts and Architecture": "ART-ARC","Arts Education": "ARTS ED","Asian": "ASIAN","Asian American Studies": "ASIA-AM","Astronomy": "ASTR","Atmospheric and Oceanic Sciences": "A-O-SCI","Bioengineering": "BIOENGR","Bioinformatics (Graduate)": "BIOINFO","Biological Chemistry": "BIOL-CH","Biomathematics": "BIOMATH","Biomedical Research": "BMD-RES","Biostatistics": "BIOSTAT","Central and East European Studies": "C-EE-ST","Chemical Engineering": "CH-ENGR","Chemistry and Biochemistry": "CHEM","Chicana and Chicano Studies": "CHICANO","Chinese": "CHIN","Civic Engagement": "CIVIC","Civil and Environmental Engineering": "C-EE","Classics": "CLASSIC","Communication Studies": "COMM-ST","Community Health Sciences": "COM-HLT","Comparative Literature": "COM-LIT","Computational and Systems Biology": "C-S-BIO","Computer Science": "COM-SCI","Conservation of Archaeological and Ethnographic Materials": "CAEM","Dance": "DANCE","Dentistry": "DENT","Design / Media Arts": "DESMA","Digital Humanities": "DGT-HUM","Disability Studies": "DIS-STD","Dutch": "DUTCH","Earth, Planetary, and Space Sciences": "EPS-SCI","Ecology and Evolutionary Biology": "EE-BIOL","Economics": "ECON","Education": "EDUC","Electrical and Computer Engineering": "EC-ENGR","Engineering": "ENGR","English": "ENGL","English as A Second Language": "ESL","English Composition": "ENGCOMP","Environment": "ENVIRON","Environmental Health Sciences": "ENV-HLT","Epidemiology": "EPIDEM","Ethnomusicology": "ETHNMUS","Filipino": "FILIPNO","Film and Television": "FILM-TV","French": "FRNCH","Gender Studies": "GENDER","General Education Clusters": "GE-CLST","Geography": "GEOG","German": "GERMAN","Gerontology": "GRNTLGY","Global Studies": "GLBL-ST","Graduate Student Professional Development": "GRAD-PD","Greek": "GREEK","Health Policy and Management": "HLT-POL","Hebrew": "HEBREW","Hindi-Urdu": "HIN-URD","History": "HIST","Honors Collegium": "HNRS","Human Genetics": "HUM-GEN","Hungarian": "HNGAR","Indigenous Languages of the Americas": "IL-AMER","Indo-European Studies": "I-E-STD","Indonesian": "INDO","Information Studies": "INF-STD","International and Area Studies": "I-A-STD","International Development Studies": "INTL-DV","Iranian": "IRANIAN","Islamic Studies": "ISLM-ST","Italian": "ITALIAN","Japanese": "JAPAN","Jewish Studies": "JEWISH","Korean": "KOREA","Labor and Workplace Studies": "LBR-WS","Latin": "LATIN","Latin American Studies": "LATN-AM","Law (Undergraduate)": "UG-LAW","Lesbian, Gay, Bisexual, Transgender, and Queer Studies": "LGBTQS","Life Sciences": "LIFESCI","Linguistics": "LING","Management": "MGMT","Materials Science and Engineering": "MAT-SCI","Mathematics": "MATH","Mechanical and Aerospace Engineering": "MECH-AE","Medical History": "MED-HIS","Medicine": "MED","Microbiology, Immunology, and Molecular Genetics": "MIMG","Middle Eastern Studies": "M-E-STD","Military Science": "MIL-SCI","Molecular and Medical Pharmacology": "M-PHARM","Molecular Biology": "MOL-BIO","Molecular Toxicology": "MOL-TOX","Molecular, Cell, and Developmental Biology": "MCD-BIO","Molecular, Cellular, and Integrative Physiology": "MC-IP","Music": "MUSC","Music History": "MSC-HST","Music Industry": "MSC-IND","Musicology": "MUSCLG","Naval Science": "NAV-SCI","Near Eastern Languages": "NR-EAST","Neurobiology": "NEURBIO","Neurology": "NEURLGY","Neuroscience (Graduate)": "NEURO","Neuroscience": "NEUROSC","Nursing": "NURSING","Obstetrics and Gynecology": "OBGYN","Oral Biology": "ORL-BIO","Orthopaedic Surgery": "ORTHPDC","Pathology and Laboratory Medicine": "PATH","Philosophy": "PHILOS","Physics": "PHYSICS","Physics and Biology in Medicine": "PBMED","Physiological Science": "PHYSCI","Physiology": "PHYSIOL","Polish": "POLSH","Political Science": "POL-SCI","Portuguese": "PORTGSE","Program in Computing": "COMPTNG","Psychiatry and Biobehavioral Sciences": "PSYCTRY","Psychology": "PSYCH","Public Health": "PUB-HLT","Public Policy": "PUB-PLC","Religion, Study of": "RELIGN","Romanian": "ROMANIA","Russian": "RUSSN","Scandinavian": "SCAND","Science Education": "SCI-EDU","Semitic": "SEMITIC","Serbian/Croatian": "SRB-CRO","Slavic": "SLAVC","Social Thought": "SOC-THT","Social Welfare": "SOC-WLF","Society and Genetics": "SOC-GEN","Sociology": "SOCIOL","South Asian": "S-ASIAN","Southeast Asian": "SEASIAN","Spanish": "SPAN","Statistics": "STATS","Surgery": "SURGERY","Swahili": "SWAHILI","Thai": "THAI","Theater": "THEATER","Turkic Languages": "TURKIC","University Studies": "UNIV-ST","Urban Planning": "URBN-PL","Vietnamese": "VIETMSE","World Arts and Cultures": "WL-ARTS","Yiddish": "YIDDSH"};

/**
 * Parse data from myUCLA and call functions to fetch Bruinwalk and create buttons.
 * 
 * @param {Dictionary} res Dictionary contains information from class planner for a particular course
 * @returns {void}
 */
function findClassPlannerInstructor(res) {
    let id;
    if (res['sections']) {
        id = res['sections'][0]['id']
    } else {
        id = res['id'];
    }

    let abbreviateCourseName = "";
    if (res['major'] && res['course-number']) {
        abbreviateCourseName = classDict[res['major'].trim()] + '-' + res['course-number'];
    } else {
        let courseMajor = res['course-title-0'].split(": ")[1];
        let courseNum = res['course-title-1'].split(" - ")[0];
        abbreviateCourseName = classDict[courseMajor] + '-' + courseNum;
    }

    // transforming a div for splitting multiple instructors and be able to inject button element
    let transformedDiv = transformInstDiv(res['instructor-div']);

    // iterate through each newly transformed div to create button and div
    for (let profNameDiv of transformedDiv.getElementsByClassName('instructor-container')) {
        getSearchResult(abbreviateCourseName, profNameDiv.innerText, ((instUrl) => {
            // case: does not find instructor result from Bruinwalk. Create N/A Button
            if (instUrl == "") {
                showPopup("", profNameDiv, "", "")
            } else {
                chrome.runtime.sendMessage({
                    url: instUrl,
                    contentScriptQuery: "getBruinwalkData",
                }, responseHTMLString => {
                    let responseHTML = stringToHTML(responseHTMLString);
                    showPopup(instUrl, profNameDiv, id, responseHTML);
                });
            }
        }))
    }
}

/**
 * Populate bruinwalk url of a class, then fetch url of professor and class who teaches the param class
 * 
 * @param {string} fullCourseName course name formatted as "ABBREVIATION-CLASSNUMBER"
 * @param {string} instName instructor name formatted as "LAST, INITITAL_FIRST. INITIAL_MID."
 * @param handler callback function to create bruinwalk button on class planner
 * @returns {void}
 */
function getSearchResult(fullCourseName, instName, handler) {
    const instNameArr = instName.split(/[ ,.]+/).slice(0, -1);
    let url = "https://www.bruinwalk.com/classes/" + encodeURI(fullCourseName.toLowerCase());
    // Note: still need to take care of a case where a class has multiple bruinwalk review pages
    // This version only takes care of all professors in one bruinwalk page
    chrome.runtime.sendMessage({
            url: url,
            contentScriptQuery: "getBruinwalkData",
        }
        // from background.js, we get string of html back
        , responseHTMLString => {
            // find Bruinwalk url of professor based on name on myULCA
            const instUrl = fetchInstBruinwalk(responseHTMLString, instNameArr);
            handler(instUrl);
        }
    );
}

/**
 * Get instructor bruinwalk url if they teach the class
 * 
 * @param {string} responseHTMLString text version of a class' bruinwalk page
 * @param {String[]} instNameArr list of instructors in a particular class from class planner
 * @return {string} url of instructor and the class that user is taking. Otherwise, empty string
 */
function fetchInstBruinwalk(responseHTMLString, instNameArr) {
    let responseHTML = stringToHTML(responseHTMLString);
    profNames = responseHTML.getElementsByClassName('prof');
    for (let i = 0; i < profNames.length; i++) {
        fullname = profNames[i].innerText.split(" ");
        firstName = fullname[0];
        lastName = fullname[fullname.length - 1];

        // comparing to only last name
        if (lastName == instNameArr[0]) {
            let bwInstDiv = profNames[i].parentNode;
            let instAndClassUrl = bwInstDiv.getAttribute("href");
            return "https://www.bruinwalk.com" + instAndClassUrl;
        }
    }
    return "";
}

/**
 * Interface to parse HTML code from a string into a DOM
 * 
 * @global
 * @constant {DOMParser}
 * @readonly
 */
let parser = new DOMParser();

/**
 * Turn string of html into html element
 * @param {string} str string of html
 * @returns {HTMLCollection} html element
 */
function stringToHTML(str) {
    return parser.parseFromString(str, 'text/html');
}

/**
 * Convert pure cell into a div for one instructor, so it can append button next to the instructor
 * @param {HTMLCollection} instDiv cell inside class planner that contains instructor name
 * @returns {HTMLCollection} Transformed instructor div
 */
function transformInstDiv(instDiv) {
    instName = instDiv.innerText.split('\n');
    instDiv.innerHTML = "";
    for (let i = 0; i < instName.length; i++) {
        let newInstDiv = document.createElement('div');
        newInstDiv.classList = 'instructor-name';
        newInstDiv.innerText = instName[i];

        let container = document.createElement('div');
        container.classList = 'instructor-container';
        container.appendChild(newInstDiv);
        instDiv.appendChild(container);
    }
    return instDiv
}

//module.exports = fetchInstBruinwalk; // uses for unit test. Otherwise, vanilla js won't recognize