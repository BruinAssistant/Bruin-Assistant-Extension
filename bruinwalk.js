findClassInst();
// reuse observer from groupme.js
observer.observe(document.querySelector('.hide-small'), config);

/**
 * Main function to seach instructor Bruinwalk information and display popup to be.my.ucla.edu class planner
 */
function findClassInst(){
    var classDict = {"Aerospace Studi`es": "AERO-ST","African American Studies": "AF-AMER","African Studies": "AFRC-ST","Afrikaans": "AFRKAAN","American Indian Studies": "AM-IND","American Sign Language": "ASL","Ancient Near East": "AN-N-EA","Anesthesiology": "ANES","Anthropology": "ANTHRO","Applied Linguistics": "APPLING","Arabic": "ARABIC","Archaeology": "ARCHEOL","Architecture and Urban Design": "ARCH-UD","Armenian": "ARMENIA","Art": "ART","Art History": "ART-HIS","Arts and Architecture": "ART-ARC","Arts Education": "ARTS ED","Asian": "ASIAN","Asian American Studies": "ASIA-AM","Astronomy": "ASTR","Atmospheric and Oceanic Sciences": "A-O-SCI","Bioengineering": "BIOENGR","Bioinformatics (Graduate)": "BIOINFO","Biological Chemistry": "BIOL-CH","Biomathematics": "BIOMATH","Biomedical Research": "BMD-RES","Biostatistics": "BIOSTAT","Central and East European Studies": "C-EE-ST","Chemical Engineering": "CH-ENGR","Chemistry and Biochemistry": "CHEM","Chicana and Chicano Studies": "CHICANO","Chinese": "CHIN","Civic Engagement": "CIVIC","Civil and Environmental Engineering": "C-EE","Classics": "CLASSIC","Communication Studies": "COMM-ST","Community Health Sciences": "COM-HLT","Comparative Literature": "COM-LIT","Computational and Systems Biology": "C-S-BIO","Computer Science": "COM-SCI","Conservation of Archaeological and Ethnographic Materials": "CAEM","Dance": "DANCE","Dentistry": "DENT","Design / Media Arts": "DESMA","Digital Humanities": "DGT-HUM","Disability Studies": "DIS-STD","Dutch": "DUTCH","Earth, Planetary, and Space Sciences": "EPS-SCI","Ecology and Evolutionary Biology": "EE-BIOL","Economics": "ECON","Education": "EDUC","Electrical and Computer Engineering": "EC-ENGR","Engineering": "ENGR","English": "ENGL","English as A Second Language": "ESL","English Composition": "ENGCOMP","Environment": "ENVIRON","Environmental Health Sciences": "ENV-HLT","Epidemiology": "EPIDEM","Ethnomusicology": "ETHNMUS","Filipino": "FILIPNO","Film and Television": "FILM-TV","French": "FRNCH","Gender Studies": "GENDER","General Education Clusters": "GE-CLST","Geography": "GEOG","German": "GERMAN","Gerontology": "GRNTLGY","Global Studies": "GLBL-ST","Graduate Student Professional Development": "GRAD-PD","Greek": "GREEK","Health Policy and Management": "HLT-POL","Hebrew": "HEBREW","Hindi-Urdu": "HIN-URD","History": "HIST","Honors Collegium": "HNRS","Human Genetics": "HUM-GEN","Hungarian": "HNGAR","Indigenous Languages of the Americas": "IL-AMER","Indo-European Studies": "I-E-STD","Indonesian": "INDO","Information Studies": "INF-STD","International and Area Studies": "I-A-STD","International Development Studies": "INTL-DV","Iranian": "IRANIAN","Islamic Studies": "ISLM-ST","Italian": "ITALIAN","Japanese": "JAPAN","Jewish Studies": "JEWISH","Korean": "KOREA","Labor and Workplace Studies": "LBR-WS","Latin": "LATIN","Latin American Studies": "LATN-AM","Law (Undergraduate)": "UG-LAW","Lesbian, Gay, Bisexual, Transgender, and Queer Studies": "LGBTQS","Life Sciences": "LIFESCI","Linguistics": "LING","Management": "MGMT","Materials Science and Engineering": "MAT-SCI","Mathematics": "MATH","Mechanical and Aerospace Engineering": "MECH-AE","Medical History": "MED-HIS","Medicine": "MED","Microbiology, Immunology, and Molecular Genetics": "MIMG","Middle Eastern Studies": "M-E-STD","Military Science": "MIL-SCI","Molecular and Medical Pharmacology": "M-PHARM","Molecular Biology": "MOL-BIO","Molecular Toxicology": "MOL-TOX","Molecular, Cell, and Developmental Biology": "MCD-BIO","Molecular, Cellular, and Integrative Physiology": "MC-IP","Music": "MUSC","Music History": "MSC-HST","Music Industry": "MSC-IND","Musicology": "MUSCLG","Naval Science": "NAV-SCI","Near Eastern Languages": "NR-EAST","Neurobiology": "NEURBIO","Neurology": "NEURLGY","Neuroscience (Graduate)": "NEURO","Neuroscience": "NEUROSC","Nursing": "NURSING","Obstetrics and Gynecology": "OBGYN","Oral Biology": "ORL-BIO","Orthopaedic Surgery": "ORTHPDC","Pathology and Laboratory Medicine": "PATH","Philosophy": "PHILOS","Physics": "PHYSICS","Physics and Biology in Medicine": "PBMED","Physiological Science": "PHYSCI","Physiology": "PHYSIOL","Polish": "POLSH","Political Science": "POL-SCI","Portuguese": "PORTGSE","Program in Computing": "COMPTNG","Psychiatry and Biobehavioral Sciences": "PSYCTRY","Psychology": "PSYCH","Public Health": "PUB-HLT","Public Policy": "PUB-PLC","Religion, Study of": "RELIGN","Romanian": "ROMANIA","Russian": "RUSSN","Scandinavian": "SCAND","Science Education": "SCI-EDU","Semitic": "SEMITIC","Serbian/Croatian": "SRB-CRO","Slavic": "SLAVC","Social Thought": "SOC-THT","Social Welfare": "SOC-WLF","Society and Genetics": "SOC-GEN","Sociology": "SOCIOL","South Asian": "S-ASIAN","Southeast Asian": "SEASIAN","Spanish": "SPAN","Statistics": "STATS","Surgery": "SURGERY","Swahili": "SWAHILI","Thai": "THAI","Theater": "THEATER","Turkic Languages": "TURKIC","University Studies": "UNIV-ST","Urban Planning": "URBN-PL","Vietnamese": "VIETMSE","World Arts and Cultures": "WL-ARTS","Yiddish": "YIDDSH"};

    var uclaClasses = document.getElementsByClassName("courseItem");
    for (var i = 0; i < uclaClasses.length; i++){
        // only get instructor name. Excluding TA
        const courseTable = uclaClasses[i].getElementsByClassName('hide-small');
        var instName = courseTable[7].innerText

        var courseMajor = uclaClasses[i].getElementsByTagName('p')[0].innerText.split(": ")[1];
        var courseNum = uclaClasses[i].getElementsByTagName('p')[1].innerText.split(" - ")[0];

        var fullCourseName = classDict[courseMajor] + '-' + courseNum;

        // loop to get search result of all professor name
        // there are cases of more than one instructors in one table
        var allInstName = instName.split(/\n/);
        for (var j = 0; j < allInstName.length; j++){

            // ignore if it is empty string or '...' after split
            if(allInstName[j] != "..."){
                console.log("Attempt to find instructor ", allInstName[j]);
                getSearchResult(fullCourseName, allInstName[j], (instUrl => {
                    if (instUrl != null){
                        var bruinwalkLink = document.createElement('a');
                        bruinwalkLink.href = instUrl;
                        bruinwalkLink.innerText = "Redirect to bruinwalk";
                        courseTable[7].appendChild(bruinwalkLink);
                    }
                }));
                // createBruinwalkButton(instUrl);
            }
        }
    }
}
/**
 * populate bruinwalk url of a class, then fetch url of professor and class who teaches the param class
 * @param fullCourseName course name formatted as "ABBREVIATION-CLASSNUMBER"
 * @param instName instructor name formatted as "LAST, INITITAL_FIRST. INITIAL_MID."
 * @param handler callback function to create bruinwalk button on class planner
 */
function getSearchResult(fullCourseName, instName, handler){
    const instNameArr = instName.split(/[ ,.]+/).slice(0,-1);

    // var url = "https://az.bruinwalk.com/search/?q=" + encodeURI(query) + "&category=all";
    var url = "https://az.bruinwalk.com/classes/" + encodeURI(fullCourseName.toLowerCase());
    
    chrome.runtime.sendMessage({
        url: url,
        contentScriptQuery: "getBruinwalkData",
    }
    // from background.js, we get string of html back. Not sure if there's a better way
    , responseHTMLString => {

        // convert string to html
        var instUrl = fetchInstBruinwalk(responseHTMLString, instNameArr);
        // createBruinwalkButton(instUrl);
        console.log(instUrl);
        handler(instUrl);
    }
    );
}

/**
 * get instructor bruinwalk url if they teach the class
 * @param responseHTMLString text version of a class' bruinwalk page
 * @param instNameArr list of instructors in a particular class from class planner
 * @return url of instructor and the class that user is taking. Otherwise, null
 */
function fetchInstBruinwalk(responseHTMLString, instNameArr){
    var stringToHTML = function (str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc;
    };

    var responseHTML = stringToHTML(responseHTMLString);
    // console.log(responseHTML);
    profNames = responseHTML.getElementsByClassName('prof');
    for(var i = 0; i < profNames.length; i++){
        fullname = profNames[i].innerText.split(" ");
        firstName = fullname[0];
        lastName = fullname[fullname.length - 1];

        // comparing to only last name (Not sure if first name is necessary)
        if (lastName == instNameArr[0]){
            console.log('found Prof!');
            bwInstDiv = profNames[i].parentNode;
            var instAndClassUrl = $(bwInstDiv).attr('href');
            // console.log(instAndClassUrl);
            return "https://az.bruinwalk.com" + instAndClassUrl;
        }
        else {

        }
    }
    return null;
}
/*
function createBruinwalkButton(instUrl, instNameDiv){
    console.log('inside createBWButton(): ', instUrl);
    console.log(instNameDiv);
    if (instUrl == null){

    }
    else{
        
    }
}
*/