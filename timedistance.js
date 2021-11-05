// This will use the same observer from groupme.js
observer.observe(document.querySelector('.centerColumn'), config);

//var submitted = false;

getClassBuildings();

/* 
    This will return a mapping from day of week to an ordered list
    of buildings that the student must visit for that day.
    
    It has the following key-value pair
    <String> day: <Array> buildings
*/
function getClassBuildings() {
    const class_buildings = new Map();
    const week_boxes = document.getElementsByClassName('timebox');
    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let i = 0;

    for (const day_boxes of week_boxes) {
        let class_boxes = day_boxes.getElementsByClassName('planneritembox');
        let buildings = [];
        for(const class_box of class_boxes){
            let place = class_box.getElementsByClassName('hide-above-small')[1].nextSibling.data;
            let building = extractBuilding(place);
            buildings.push(building);
        }
        class_buildings.set(day[i],buildings);
        i++;
    }

    /*if(!submitted){
        let form = document.forms;
        console.log(form);
        form[0][40].value = "Aerospace Studies (AERO ST)";
        form[0][41].value = "A - Leadership Laboratory";
        form[0][42].disabled = false;
        form[0].submit();
        console.log(form);
        submitted = true;
    }*/

    console.log(class_buildings);
    return class_buildings;
}

function extractBuilding(place){
    // This regex expression will filter out any room numbers
    let noNumbers = /[^0-9]+/;
    // exec(place) will return a map with the first index being our result
    return (noNumbers.exec(place)[0]).trim();
}