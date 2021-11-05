// This will use the same observer from groupme.js
observer.observe(document.querySelector('.centerColumn'), config);

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

// TODO 
function populateTimeDistance(response, ordered_classes){
    console.log(response);
    console.log(ordered_classes);

    let td_matrix = response.rows;


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
    
    chrome.runtime.sendMessage({
        url: map_url,
        contentScriptQuery: "getTimeDistanceData"
    }
        , response => {
            populateTimeDistance(response, class_info.get("orderedClasses"));
        }
    );

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