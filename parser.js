/**
 * @file This file carries out the parsing of DOM infomration 
 * on the UCLA class planner website.
 * 
 * @author Johnson Zhou (Clumsyndicate)
 */

/**
 * Parses DOM information of a .courseItem element into JSON
 * 
 * Callbacks is an Object that maps string keys to callback functions
 * 
 * @param {HTMLElement} courseItem 
 * @param {Object} callbacks
 */

function parseCourseItem(courseItem, callbacks) {
    let res = {};

    // This gets the Class title
    /*
    <td class="SubjectAreaName_ClassName" id="enrPanelDst-17402585-top">
        <p>Class 1: Computer Science</p>
        <p>118 - Computer Network Fundamentals</p>
    </td>
    */
    res["course-title-0"] = courseItem.getElementsByClassName("SubjectAreaName_ClassName").item(0).children.item(0).innerText;
    res["course-title-1"] = courseItem.getElementsByClassName("SubjectAreaName_ClassName").item(0).children.item(1).innerText;

    res["course-name"] = /(?:[^:]*:)?(.*)/.exec(res["course-title-0"])[1].trim() + ' ' + res["course-title-1"];

    res["course-info"] = courseItem.getElementsByClassName("class_info").item(0).innerText;

    if (callbacks.forCourseItem) {
        callbacks.forCourseItem(res, courseItem);
    }
    // Now parse the Table, first each row, then calls the coursetable callback

    // Now parse the rows of the table

    let courseTable = courseItem.getElementsByClassName("coursetable").item(0);
    if (courseTable === null) {
        console.error("No table.coursetable found in the courseItem!");
    }

    // In most situations there are three tbodys, first is header row, second is lecture row, 
    // third is discussion row. Some classes, however, may not have a discussion row.
    tbodies = courseItem.getElementsByTagName('tbody');

    // This looks like 
    // ['Change', 'Section', 'Status', 'Info', 'Days', 'Time', 'Location', 'Units', 'Instructor']
    res["column-headers"] = tbodies.item(0).firstElementChild.innerText.split("\t")

    if (callbacks.forHeader) {
        callbacks.forHeader(res, tbodies.item(0));
    }

    res["sections"] = [];

    // Skips the first one because that's the header
    for (let i = 1; i < tbodies.length; i++) {
        let sectionInfo = {};
        // first element here because second is mostly enroll section stuff
        // Looks like ['Lec 1', 'Enrolled: 10 of 100 Left', '', 'TR', '10am-11:50am', 'Mathematical Sciences 4000A', '4.0', 'Zhang, L.']
        let columnTexts = tbodies.item(i).firstElementChild.innerText.trim().split("\t").map((val) => val.trim());

        sectionInfo["section"] = columnTexts[0];
        sectionInfo["status"] = columnTexts[1];
        sectionInfo["info"] = columnTexts[2];
        sectionInfo["days"] = columnTexts[3];
        sectionInfo["time"] = columnTexts[4];
        sectionInfo["location"] = columnTexts[5];
        sectionInfo["units"] = columnTexts[6];
        sectionInfo["instructor"] = columnTexts[7];

        // Other info
        // console.log(tbodies.item(i).getElementsByClassName("section-header").item(0));
        sectionInfo["id"] = tbodies.item(i).getElementsByClassName("section-header").item(0).getElementsByTagName('a').item(0).title.match(/Class Detail for ([0-9]+)/i)[1];

        if (callbacks.forEachSection) {
            callbacks.forEachSection(res, sectionInfo, tbodies.item(i));
        }

        res.sections.push(sectionInfo);
    }

    res['instructor-div'] = courseItem.getElementsByTagName("tbody")[1].getElementsByClassName("hide-small")[1];

    if (callbacks.forCourseTable) {
        callbacks.forCourseTable(res, courseTable);
    }

    console.log(res);

}

// class search section
function parseSearchItem(searchItem, callback) {
    // wait until class table is created:
    if (searchItem.getElementsByClassName("ClassSearchList search_results").item(0)) {
        let res = {};
        res['course-title-0'] = searchItem.getElementsByClassName("ClassSearchBox").item(0).value;
        res['course-title-1'] = searchItem.getElementsByClassName("row-fluid class-title").item(0).innerText;
        res['major'] = res['course-title-0'].replace(/ *\([^)]*\) */g, "");
        res['course-number'] = res['course-title-1'].split(" - ")[0];

        for (section of searchItem.getElementsByClassName("row-fluid data_row class-info scrollable-collapse table-width2")) {
            res['id'] = section.getElementsByClassName("span2").item(0).getElementsByTagName('a').item(0).title.match(/\d+/g)[0];
            res['instructor-div'] = section.getElementsByClassName("span9 hide-small").item(0);
            callback(res);
        }
    }
}

// For demo purposes
function callParseCourseItem() {
    for (let courseItem of document.getElementsByClassName("courseItem")) {
        // work on injecting buttons
        parseCourseItem(courseItem, {
            "forCourseTable": (res, courseTable) => {
                findClassPlannerInstructor(res);
            }
        });
    }
}

function callParseSearchItem() {
    // for "Search for Class and Add to Plan"
    // use ClassSearchWidget since only the search box contains major name
    for (let searchItem of document.getElementsByClassName("ClassSearchWidget")) {
        parseSearchItem(searchItem, (res) => {
            findClassPlannerInstructor(res);
        })
    }
}