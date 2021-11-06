// This will use the same observer from groupme.js
observer.observe(document.querySelector('.centerColumn'), config);

// TODO: Double check proper mappings
const department_abbrev = new Map([
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

        // get class department and number (for class info lookups)
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
        ["700 Westwood Plaza", new Coord(34.06693695833717, -118.4448437749579)],
        ["1010 Westwood Center", new Coord(34.062367842236796, -118.44505990379362)],
        ["Ackerman Union", new Coord(34.07061783552888, -118.44420560194396)],
        ["Biomedical Sciences Research Building", new Coord(34.067354619343014, -118.44130557310837)],
        ["Boelter Hall", new Coord(34.06927673596064, -118.44314214158828)],
        ["Botany Building", new Coord(34.06699323253283, -118.44108758660148)],
        ["Boyer Hall", new Coord(34.06830107967037, -118.441655901944)],
        ["Bradley Hall", new Coord(34.069892812200564, -118.44907931543702)],
        ["Brain Mapping Center", new Coord(34.067009858138334, -118.44440165961545)],
        ["Brain Research Institute", new Coord(34.06753326915666, -118.44471388475186)],
        ["Broad Art Center", new Coord(34.07605382686575, -118.44096471543688)],
        ["Bunche Hall", new Coord(34.0744671641443, -118.44011757310827)],
        ["California NanoSystems Institute", new Coord(34.06819835504753, -118.4428800000944)],
        ["Campbell Hall", new Coord(34.073822757539055, -118.4412273000944)],
        ["Canyon Point", new Coord(34.07359230559998, -118.45103385961517)],
        ["Carnesale Commons", new Coord(34.07207665724031, -118.44949300009435)],
        ["Center for the Health Sciences", new Coord(34.066275558678655, -118.44207574612233)],
        ["Collins Center for Executive Education", new Coord(34.07370883986546, -118.44463836331438)],
        ["Cornell Hall", new Coord(34.07417213061734, -118.44339498845082)],
        ["Covel Commons", new Coord(34.073219454243, -118.44995204427262)],
        ["De Neve Plaza Commons Building", new Coord(34.07098143697784, -118.4501300866013)],
        ["Dentistry, School of", new Coord(34.066540396446705, -118.44199143077967)],
        ["Dodd Hall", new Coord(34.072770972418695, -118.43939211543696)],
        ["Downtown Center", new Coord(34.05911359159337, -118.2803091846574)],
        ["East Melnitz Hall", new Coord(34.076635172087215, -118.43942248845094)],
        ["Education and Information Studies Building", new Coord(34.070569076115106, -118.44254134427271)],
        ["Engineering I", new Coord(34.068769401762815, -118.44447121947147)],
        ["Engineering IV", new Coord(34.06924376871353, -118.44432790739828)],
        ["Engineering V", new Coord(34.06970012685327, -118.44368661543703)],
        ["Engineering VI", new Coord(34.06965066498041, -118.4437638546126)],
        ["Entrepreneurs Hall", new Coord(34.07382109198659, -118.44336680009432)],
        ["Factor Health Sciences Building", new Coord(34.06698642840647, -118.44360184420151)],
        ["Fernald Center", new Coord(34.07655532586608, -118.44284347762654)],
        ["Field", new Coord(34.07240146934583, -118.44685180194392)],
        ["Fowler Museum at UCLA", new Coord(34.073131132692396, -118.44305491543702)],
        ["Franz Hall", new Coord(34.06977549013749, -118.4412362866013)],
        ["Geffen Hall", new Coord(34.06440506221056, -118.44235545961538)],
        ["Geology Building", new Coord(34.06940011483661, -118.44055781543707)],
        ["Gold Hall", new Coord(34.07372594871459, -118.4436591384509)],
        ["Gonda (Goldschmied) Neuroscience and Genetics Research Center", new Coord(34.06542486559988, -118.44723186883748)],
        ["Haines Hall", new Coord(34.07297623721399, -118.44115199519744)],
        ["Hammer Museum", new Coord(34.0597166547792, -118.44368375961538)],
        ["Hedrick Hall", new Coord(34.07341887984911, -118.45221587495782)],
        ["Hershey Hall", new Coord(34.06679355101938, -118.43985150194395)],
        ["Hitch Residential Suites", new Coord(34.07373197909357, -118.45371793077958)],
        ["Humanities Building", new Coord(34.07171419871093, -118.44127964602781)],
        ["James West Center", new Coord(34.070471235944105, -118.4451430866012)],
        ["Jules Stein Eye Institute", new Coord(34.06491686384691, -118.44398277310833)],
        ["Kaufman Hall", new Coord(34.073965503578236, -118.4442240496137)],
        ["Kerckhoff Hall", new Coord(34.07063259934642, -118.44355748660129)],
        ["Kinsey Science Teaching Pavilion", new Coord(34.07034386178524, -118.44136834427258)],
        ["Knudsen Hall", new Coord(34.07079328618486, -118.44107564427274)],
        ["Korn Convocation Hall", new Coord(34.07387991317846, -118.44312533077957)],
        ["La Kretz Garden Pavilion", new Coord(34.06676203301789, -118.44153223077969)],
        ["La Kretz Hall", new Coord(34.06775504340902, -118.44269563077962)],
        ["Lab School 1", new Coord(34.075359640735805, -118.4441230019438)],
        ["Law Building", new Coord(34.072834670162216, -118.43873265775424)],
        ["Life Sciences", new Coord(34.06757981884672, -118.44040524427275)],
        ["Lu Valle Commons", new Coord(34.073789718271776, -118.43941739214993)],
        ["MacDonald Medical Research Laboratories", new Coord(34.06733974481398, -118.44427897310828)],
        ["Macgowan Hall", new Coord(34.07610364667738, -118.43967057310815)],
        ["Macgowan Hall East", new Coord(34.07593367869698, -118.43966751516949)],
        ["Marion Anderson Hall", new Coord(34.0740785960199, -118.44295632818209)],
        ["Marion Davies Children's Center", new Coord(34.065421750246415, -118.44198989084667)],
        ["Mathematical Sciences", new Coord(34.07079353192487, -118.44094973984707)],
        ["Medical Plaza 100", new Coord(34.06564738635145, -118.44574927495792)],
        ["Medical Plaza 200", new Coord(34.06506957561769, -118.44681577920316)],
        ["Medical Plaza 300", new Coord(34.06458524972706, -118.44606383077969)],
        ["Melnitz Hall", new Coord(34.07661101235114, -118.44000980194392)],
        ["Molecular Sciences Building", new Coord(34.06821968915325, -118.44086534677987)],
        ["Moore Hall", new Coord(34.070494834778856, -118.44261903752619)],
        ["Morton Medical Building", new Coord(34.06523159728839, -118.44547863742048)],
        ["Murphy Hall", new Coord(34.07201228637565, -118.43860514242309)],
        ["Neuroscience Research Building", new Coord(34.06765723088129, -118.44358820194387)],
        ["No facility", null],
        ["No Location", null],
        ["Northwest Campus Auditorium", new Coord(34.0721306088205, -118.45047378660131)],
        ["Off campus", null],
        ["Online", null],
        ["Online - Recorded", null],
        ["Orthopaedic Hospital Research Center", new Coord(34.0675689815136, -118.44120280194402)],
        ["Ostin Music Center", new Coord(34.07046696146252, -118.44027788660142)],
        ["Perloff Hall", new Coord(34.07366736615829, -118.44024534612211)],
        ["Physics and Astronomy Building", new Coord(34.07084656284753, -118.44158000194393)],
        ["Portola Plaza Building", new Coord(34.0703763955532, -118.44184409797171)],
        ["Powell Library Building", new Coord(34.07170168372432, -118.44215751471553)],
        ["Pritzker Hall", new Coord(34.06979737917609, -118.44075760316845)],
        ["Public Affairs Building", new Coord(34.074316015804875, -118.4385481962411)],
        ["Public Health, School of", new Coord(34.06700817053388, -118.44333609454576)],
        ["Reed Neurological Research Center", new Coord(34.06640504609998, -118.44443114666824)],
        ["Renee and David Kaplan Hall", new Coord(34.07131425924011, -118.441118715437)],
        ["Rieber Hall", new Coord(34.071877196473764, -118.45159800379358)],
        ["Rolfe Hall", new Coord(34.07395050481058, -118.44204757310818)],
        ["Rosenfeld Library", new Coord(34.074146617522885, -118.44345567310828)],
        ["Royce Hall", new Coord(34.072924325772995, -118.44218065821016)],
        ["Schoenberg Music Building", new Coord(34.07116180085136, -118.44047522468482)],
        ["Sculpture Garden", new Coord(34.07523978110291, -118.43986747521654)],
        ["Semel Institute for Neuroscience and HumanBehavior", new Coord(34.06596987154504, -118.4448672866014)],
        ["Slichter Hall", new Coord(34.06934527816948, -118.4404310270805)],
        ["Sproul Hall", new Coord(34.07214633465558, -118.44958042892998)],
        ["Strathmore Building", new Coord(34.06832776766664, -118.4452304951975)],
        ["Student Activities Center", new Coord(34.07169768711251, -118.44412921728663)],
        ["Terasaki Life Sciences Building", new Coord(34.06735914419834, -118.43988990433964)],
        ["UCLA Lab School, Seeds Campus", new Coord(34.07537041450641, -118.44410268434461)],
        ["Ueberroth Building", new Coord(34.06420631417785, -118.44689975776575)],
        ["Vatche and Tamar Manoukian Medical Building", new Coord(34.06571249653149, -118.445824201944)],
        ["Wendy and Leonard Goldberg Medical Building", new Coord(34.06468576168065, -118.44608585961541)],
        ["West Medical", new Coord(34.0605666089195, -118.44778532706898)],
        ["William Andrews Clark Memorial Library", new Coord(34.033745869528914, -118.31448379285351)],
        ["Wooden Recreation and Sports Center", new Coord(34.07127162866979, -118.44570073946167)],
        ["Young Hall", new Coord(34.06876052882566, -118.44152213130202)],
        ["Young Research Library", new Coord(34.075075721540614, -118.44095101783246)]
    ])

    // parse all class info from webpage
    let class_info = getClassBuildings();

    // Construct unique building coordinates by indexing into coordinate table
    let unique_buildings = [];
    for (let building of class_info.get("uniqueBuildings")){
        let val = coords.get(building);
        if(val != null) // only add if not null
            unique_buildings.push(val);
    }

    console.log(unique_buildings);

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
