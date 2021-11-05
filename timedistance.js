// This will use the same observer from groupme.js
observer.observe(document.querySelector('.centerColumn'), config);

// TODO: Double check proper mappings
let department_abbrev = new Map([
    ["Aerospace Studies", "AERO ST"],
    ["African American Studies", "AF AMER"],
    ["African Studies", "AFRC ST"],
    ["Afrikaans", "AFRKAAN"],
    ["American Indian Studies", "AM IND"],
    ["American Sign Language", "ASL"],
    ["Ancient Near East", "AN N EA"],
    ["Anesthesiology", "ANES"],
    ["Anthropology", "ANTHRO"],
    ["Applied Linguistics", "APPLING"],
    ["Arabic", "ARABIC"],
    ["Archaeology", "ARCHEOL"],
    ["Architecture and Urban Design", "ARCH UD"],
    ["Armenian", "ARMENIA"],
    ["Art", "ART"],
    ["Art History", "ART HIS"],
    ["Arts and Architecture", "ART ARC"],
    ["Arts Education", "ARTS ED"],
    ["Asian", "ASIAN"],
    ["Asian American Studies", "ASIA AM"],
    ["Astronomy", "ASTR"],
    ["Atmospheric and Oceanic Sciences", "A O SCI"],
    ["Bioengineering", "BIOENGR"],
    ["Bioinformatics (Graduate)", "BIOINFO"],
    ["Biological Chemistry", "BIOL CH"],
    ["Biomathematics", "BIOMATH"],
    ["Biomedical Research", "BMD RES"],
    ["Biostatistics", "BIOSTAT"],
    ["Central and East European Studies", "C EE ST"],
    ["Chemical Engineering", "CH ENGR"],
    ["Chemistry and Biochemistry", "CHEM"],
    ["Chicana and Chicano Studies", "CHICANO"],
    ["Chinese", "CHIN"],
    ["Civic Engagement", "CIVIC"],
    ["Civil and Environmental Engineering", "C EE"],
    ["Classics", "CLASSIC"],
    ["Communication Studies", "COMM ST"],
    ["Community Health Sciences", "COM HLT"],
    ["Comparative Literature", "COM LIT"],
    ["Computational and Systems Biology", "C S BIO"],
    ["Computer Science", "COM SCI"],
    ["Conservation of Archaeological and Ethnographic Materials", "CAEM"],
    ["Dance", "DANCE"],
    ["Dentistry", "DENT"],
    ["Design / Media Arts", "DESMA"],
    ["Digital Humanities", "DGT HUM"],
    ["Disability Studies", "DIS STD"],
    ["Dutch", "DUTCH"],
    ["Earth, Planetary, and Space Sciences", "EPS SCI"],
    ["Ecology and Evolutionary Biology", "EE BIOL"],
    ["Economics", "ECON"],
    ["Education", "EDUC"],
    ["Electrical Engineering", "EL ENGR"],
    ["Engineering", "ENGR"],
    ["English", "ENGL"],
    ["English as A Second Language", "ESL"],
    ["English Composition", "ENGCOMP"],
    ["Environment", "ENVIRON"],
    ["Environmental Health Sciences", "ENV HLT"],
    ["Epidemiology", "EPIDEM"],
    ["Ethnomusicology", "ETHNMUS"],
    ["Filipino", "FILIPNO"],
    ["Film and Television", "FILM TV"],
    ["French", "FRNCH"],
    ["Gender Studies", "GENDER"],
    ["General Education Clusters", "GE CLST"],
    ["Geography", "GEOG"],
    ["German", "GERMAN"],
    ["Gerontology", "GRNTLGY"],
    ["Global Studies", "GLBL ST"],
    ["Graduate Student Professional Development", "GRAD PD"],
    ["Greek", "GREEK"],
    ["Health Policy and Management", "HLT POL"],
    ["Hebrew", "HEBREW"],
    ["Hindi Urdu", "HIN URD"],
    ["History", "HIST"],
    ["Honors Collegium", "HNRS"],
    ["Human Genetics", "HUM GEN"],
    ["Hungarian", "HNGAR"],
    ["Indigenous Languages of the Americas", "IL AMER"],
    ["Indo European Studies", "I E STD"],
    ["Indonesian", "INDO"],
    ["Information Studies", "INF STD"],
    ["International and Area Studies", "I A STD"],
    ["International Development Studies", "INTL DV"],
    ["Iranian", "IRANIAN"],
    ["Islamic Studies", "ISLM ST"],
    ["Italian", "ITALIAN"],
    ["Japanese", "JAPAN"],
    ["Jewish Studies", "JEWISH"],
    ["Korean", "KOREA"],
    ["Labor and Workplace Studies", "LBR WS"],
    ["Latin", "LATIN"],
    ["Latin American Studies", "LATN AM"],
    ["Law (Undergraduate)", "UG LAW"],
    ["Lesbian, Gay, Bisexual, Transgender, and Queer Studies", "LGBTQS"],
    ["Life Sciences", "LIFESCI"],
    ["Linguistics", "LING"],
    ["Management", "MGMT"],
    ["Materials Science and Engineering", "MAT SCI"],
    ["Mathematics", "MATH"],
    ["Mechanical and Aerospace Engineering", "MECH AE"],
    ["Medical History", "MED HIS"],
    ["Medicine", "MED"],
    ["Microbiology, Immunology, and Molecular Genetics", "MIMG"],
    ["Middle Eastern Studies", "M E STD"],
    ["Military Science", "MIL SCI"],
    ["Molecular and Medical Pharmacology", "M PHARM"],
    ["Molecular Biology", "MOL BIO"],
    ["Molecular Toxicology", "MOL TOX"],
    ["Molecular, Cell, and Developmental Biology", "MCD BIO"],
    ["Molecular, Cellular, and Integrative Physiology", "MC IP"],
    ["Music", "MUSC"],
    ["Music History", "MSC HST"],
    ["Music Industry", "MSC IND"],
    ["Musicology", "MUSCLG"],
    ["Naval Science", "NAV SCI"],
    ["Near Eastern Languages", "NR EAST"],
    ["Neurobiology", "NEURBIO"],
    ["Neurology", "NEURLGY"],
    ["Neuroscience (Graduate)", "NEURO"],
    ["Neuroscience", "NEUROSC"],
    ["Nursing", "NURSING"],
    ["Obstetrics and Gynecology", "OBGYN"],
    ["Oral Biology", "ORL BIO"],
    ["Orthopaedic Surgery", "ORTHPDC"],
    ["Pathology and Laboratory Medicine", "PATH"],
    ["Philosophy", "PHILOS"],
    ["Physics", "PHYSICS"],
    ["Physics and Biology in Medicine", "PBMED"],
    ["Physiological Science", "PHYSCI"],
    ["Physiology", "PHYSIOL"],
    ["Polish", "POLSH"],
    ["Political Science", "POL SCI"],
    ["Portuguese", "PORTGSE"],
    ["Program in Computing", "COMPTNG"],
    ["Psychiatry and Biobehavioral Sciences", "PSYCTRY"],
    ["Psychology", "PSYCH"],
    ["Public Health", "PUB HLT"],
    ["Public Policy", "PUB PLC"],
    ["Religion, Study of", "RELIGN"],
    ["Romanian", "ROMANIA"],
    ["Russian", "RUSSN"],
    ["Scandinavian", "SCAND"],
    ["Science Education", "SCI EDU"],
    ["Semitic", "SEMITIC"],
    ["Serbian/Croatian", "SRB CRO"],
    ["Slavic", "SLAVC"],
    ["Social Thought", "SOC THT"],
    ["Social Welfare", "SOC WLF"],
    ["Society and Genetics", "SOC GEN"],
    ["Sociology", "SOCIOL"],
    ["South Asian", "S ASIAN"],
    ["Southeast Asian", "SEASIAN"],
    ["Spanish", "SPAN"],
    ["Statistics", "STATS"],
    ["Surgery", "SURGERY"],
    ["Swahili", "SWAHILI"],
    ["Thai", "THAI"],
    ["Theater", "THEATER"],
    ["Turkic Languages", "TURKIC"],
    ["University Studies", "UNIV ST"],
    ["Urban Planning", "URBN PL"],
    ["Vietnamese", "VIETMSE"],
    ["World Arts and Cultures", "WL ARTS"],
    ["Yiddish", "YIDDSH"],
]);

// prepTimeDistance();
initiateTimeDistance();
function test(response){
    console.log(response);
}

function getLat(building){
    return (building.lat).toString();
}

function getLng(building){
    return (building.lng).toString();
}

// TODO: FINISH THIS POPULATION FUNCTION
function populateTimeDistance(response, ordered_classes){
    console.log(response);
    console.log(ordered_classes);

    //let td_matrix = response.rows;

    let class_plan_classes = document.getElementById("div_landing").getElementsByClassName("courseItem");

    for (let class_record of class_plan_classes) {
        let class_name_record = class_record.getElementsByClassName("SubjectAreaName_ClassName").item(0).children;
        
        let class_department = extractDepartmentFromClassRecord(class_name_record.item(0).innerText);
        let class_number = extractNumberFromClassRecord(class_name_record.item(1).innerText);
        
        console.log(class_department + ", " + department_abbrev.get(class_department));
        console.log(class_number);
    }
}

function extractDepartmentFromClassRecord(str) {
    return /(?<=:).*/.exec(str)[0].trim();
}

function extractNumberFromClassRecord(str) {
    return /^[^-]+/.exec(str)[0].trim();
}


function initiateTimeDistance(){
    function Coord(lat, lng){
        this.lat = lat;
        this.lng = lng;
    }

    // Populated table of building names --> coordinates
    // Placeholder for now
    const coords = new Map([
        ["Boelter Hall", new Coord(34.06927673596064, -118.44314214158828)],
        ["Geology Building B", new Coord(34.06938234016632, -118.44059000246695)],
        ["Mathematical Sciences", new Coord(34.069975013570584, -118.443113302467)],
        ["Moore Hall", new Coord(34.070503088217514, -118.44262037580916)],
        ["Online", null],
        ["Online - Recorded", null],
        ["Royce Hall", new Coord(34.072924325772995, -118.44218065821016)],
        ["Young Hall", new Coord(34.06876052882566, -118.44152213130202)],
    ])

    let class_info = getClassBuildings();

    // Construct unique building coordinates by indexing into coordinate table
    let unique_buildings = [];
    for (let building of class_info.get("uniqueBuildings")){
        let val = coords.get(building);
        if(val != null) // only add if not null
            unique_buildings.push(val);
    }

    let total_buildings = unique_buildings.length;
    let str_coord = "";
    let latStr = "";
    let lngStr = "";
    if(total_buildings > 0){
        console.log(unique_buildings[0]);
        latStr = getLat(unique_buildings[0]); 
        lngStr = getLng(unique_buildings[0]);
        // %7C is '|' and %2C is ','
        str_coord += (latStr + "%2C" + lngStr);

        for(let i = 1; i < total_buildings; i++){
            latStr = getLat(unique_buildings[i]);
            lngStr = getLng(unique_buildings[i]);
            str_coord += "%7C";
            str_coord += (latStr + "%2C" + lngStr);
        }
    }   

    // TODO: SECURE API_KEY 
    var map_url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + str_coord + "&" + "destinations=" + str_coord + "&units=imperial&mode=walking&key=";
    
    // TODO: REMOVE THIS TEMPORARY CALL
    populateTimeDistance(null, class_info.get("orderedClasses"));

    // TODO: UNCOMMENT API CALL TO DISTANCEMATRIX
    /*chrome.runtime.sendMessage({
        url: map_url,
        contentScriptQuery: "getTimeDistanceData"
    }
        , response => {
            populateTimeDistance(response, class_info.get("orderedClasses"));
        }
    );*/

}
/* 
    This return a 2-element array.

    TODO: UPDATE THIS COMMENT
    1st element: A mapping from day of week to an ordered list
    of buildings that the student must visit for that day.

    2nd element: A set of all distinct buildings students
    will visit.
*/
function getClassBuildings() {
    const result = new Map();
    function classInfo(name, section, building){
        this.name = name;
        this.section = section;
        this.building = building; 
    };
    const ordered_classes = new Map();
    const week_boxes = document.getElementsByClassName('timebox');
    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const unique_buildings = new Set();
    let i = 0;

    for (const day_boxes of week_boxes) {
        let class_boxes = day_boxes.getElementsByClassName('planneritembox');
        let classArr = [];
        for(const class_box of class_boxes){
            let class_info = class_box.innerText.split("\n");
            if(class_info.length != 3){
                console.log("Error: Parsed class info is not length 3.");
            }
            let name = class_info[0];
            let section = class_info[1];
            let place = class_info[2];
            let building = extractBuilding(place);
            classArr.push(new classInfo(name, section, building));
            unique_buildings.add(building);
        }
        ordered_classes.set(day[i], classArr);
        i++;
    }
    
    result.set("orderedClasses", ordered_classes);
    result.set("uniqueBuildings", unique_buildings);
    console.log(result);
    return result;
}

function extractBuilding(place) {

    // remove any trailing/leading whitespace
    let trimmed_place = place.trim();

    // handle special cases
    let special_cases_prefixes = ["700 Westwood Plaza", "Lab School 1", "Medical Plaza 100", "Medical Plaza 200", "Medical Plaza 300", "1010 Westwood Center"];
    for (const prefix in special_cases_prefixes) {
        if (trimmed_place.startsWith(prefix)) {
            return prefix;
        }
    }
    
    // if not special case, then general case
    let words = trimmed_place.split(" "); // split into words
    if (hasNumber(words.at(-1))) { // if the last word has any amount of numbers, we assume it's a room number (want to remove)
        return words.slice(0,words.length - 1).join(" ").trim();
    }
    else // no modification needed
        return trimmed_place;
}

function hasNumber(str) {
    return /\d/.test(str);
}