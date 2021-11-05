// This will use the same observer from groupme.js
observer.observe(document.querySelector('.centerColumn'), config);

prepTimeDistance();

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
function populateTimeDistance(response, ordered_buildings){
    console.log(response);
    console.log(ordered_buildings);

    let matrix = response.rows;
}


function prepTimeDistance(){
    function Coord(lat, lng){
        this.lat = lat;
        this.lng = lng;
    }

    // Populated table of building names --> coordinates
    // Placeholder for now
    const coords = new Map([
        ["Boelter Hall", new Coord(34.06927673596064, -118.44314214158828)],
        ["Moore Hall", new Coord(34.070503088217514, -118.44262037580916)],
        ["Online", null],
        ["Royce Hall", new Coord(34.072924325772995, -118.44218065821016)],
    ])

    let building_info = getClassBuildings();
    let ordered_buildings = building_info.get("orderedBuildings");

    // Construct unique building coordinates by indexing into coordinate table
    let unique_buildings = [];
    for (let building of building_info.get("uniqueBuildings")){
        if(building != "Online")
            unique_buildings.push(coords.get(building));
    }
    console.log(unique_buildings);
    let total_buildings = unique_buildings.length;
    let str_coord = "";
    let latStr = "";
    let lngStr = "";
    if(total_buildings > 0){
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
            populateTimeDistance(response,ordered_buildings);
        }
    );

}
/* 
    This return a 2-element array.

    1st element: A mapping from day of week to an ordered list
    of buildings that the student must visit for that day.

    2nd element: A set of all distinct buildings students
    will visit.
*/
function getClassBuildings() {
    const result = new Map();
    const ordered_buildings = new Map();
    const week_boxes = document.getElementsByClassName('timebox');
    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const unique_buildings = new Set();
    let i = 0;

    for (const day_boxes of week_boxes) {
        let class_boxes = day_boxes.getElementsByClassName('planneritembox');
        let buildings = [];
        for(const class_box of class_boxes){
            let place = class_box.getElementsByClassName('hide-above-small')[1].nextSibling.data;
            let building = extractBuilding(place);
            buildings.push(building);
            unique_buildings.add(building);
        }
        ordered_buildings.set(day[i],buildings);
        i++;
    }
    
    result.set("orderedBuildings", ordered_buildings);
    result.set("uniqueBuildings", unique_buildings);

    return result;
}

// TODO: NEED TO HANDLE CASE WHERE BUILDING NAME HAS NUMBERS
function extractBuilding(place){
    // This regex expression will filter out any room numbers
    let noNumbers = /[^0-9]+/;
    // exec(place) will return a map with the first element being our result
    return (noNumbers.exec(place)[0]).trim();
}