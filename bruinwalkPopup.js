/**
 * @file This file works on creating a bruinwalk review popup. It processes the instructor
 * url from bruinwalk.com and displays information on the popup. It also utilizes chart.js
 * to display chart and grade distribution
 * 
 * @author Nathakin "Ken" Leepreecha (KenNL42)
 */

/**
 * Create popup on myUCLA that contains Bruinwalk review metrics, metric radar chart, grade distributuion, 
 * review, and link to Bruinwalk.
 * @param {string} instUrl Bruinwalk url of instructor who teaches the class
 * @param {HTMLCollection} instDiv HTML div element of instructor cell from class planner
 * @param {string} id Unique id for creating divs that only belong to a certain instructor and a class
 * @param {HTMLCollection} responseHTML HTML of bruinwalk page of instructor who teaches the class
 * @returns {void}
 */
function showPopup(instUrl, instDiv, id, responseHTML) {
  const parts = instUrl.split("/");
  const coursename = parts[parts.length - 2];

  // -------------- create button ----------------
  // return if N/A
  let bruinwalkPopupButton = createButton(instUrl, instDiv, responseHTML, id);
  if (!bruinwalkPopupButton) {
    return;
  };

  const professorName = responseHTML.getElementsByClassName('professor-info')[0].innerText.trim();

  // ---------- create popup div that contains bruinwalk review and information
  let popup = document.createElement('div');
  popup.className = "popuptext";
  popup.id = "myPopup" + id;
  document.getElementById(id).appendChild(popup);

  // ------------- add title------------
  let titleDiv = document.createElement('div');
  titleDiv.className = 'bwalk-popup-title-div';
  titleDiv.innerHTML = coursename.toUpperCase();
  popup.appendChild(titleDiv);

  const metrics = ['Overall', 'Easiness', 'Workload', 'Clarity', 'Helpfulness'];

  // ------------ create metrics table and retrieve review metrics
  let metrics_score = createMetricsTable(metrics, responseHTML, popup);

  // ------------- create radar chart for 5 metrics---------------
  let chartDiv = document.createElement('canvas');
  chartDiv.className = "bruinwalk-radar-canvas";
  chartDiv.id = 'metricRadar' + id;
  popup.appendChild(chartDiv);

  // testing getting average
  let base_url = "https://class-planner-assistant.herokuapp.com/";
  chrome.runtime.sendMessage({
    contentScriptQuery: "getBruinwalkAverage",
    url: base_url + "average/" + coursename
  }, (response) => {
    createRadarChart(metrics, metrics_score, professorName, id, coursename, response);
  });

  // -------------- fetch distribution data --------------

  // case: no distribution yet:
  if (responseHTML.getElementsByClassName('distribution bruinwalk-card row')[0].innerText == "\n\nNo grades are available.\n") {
    let noDistDiv = document.createElement('div');
    noDistDiv.innerText = "Grade distribution is not available";
    popup.appendChild(noDistDiv);
    popup.appendChild(document.createElement("br"));
  } else {
    let gradeArray = [];
    // NOTE: only get the most recent year
    for (let i = 0; i < 13; i++) {
      let grade = responseHTML.getElementsByClassName('bar-fill has-tip tip-left')[i].getAttribute('title');
      if (grade == null) {
        // THIS PROFESSOR HASN'T TAUGHT AT UCLA YET
        return;
      }
      gradeArray.push(parseFloat(grade));
    }


    // ---------- create distribution chart ---------------
    let chartDiv = document.createElement('canvas');
    chartDiv.id = 'distributionBar' + id;
    popup.appendChild(chartDiv);
    popup.appendChild(document.createElement("br"));

    let profDistributionData = {
      labels: ['+', 'A', '-',
        '+', 'B', '-',
        '+', 'C', '-',
        '+', 'D', '-',
        '+', 'E', '-', 'F'
      ],
      datasets: [{
        label: 'Grade Distribution from ' + responseHTML.getElementById('term-selector').children.item(1).innerText,
        data: gradeArray,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }]
    };
    let profDistributionOption = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    let distributionChart = new Chart('distributionBar' + id, {
      type: 'bar',
      data: profDistributionData,
      options: profDistributionOption
    });
  }

  // --------------- get student comment ---------------------

  // case: no student review yet
  if (responseHTML.getElementsByClassName('reviews row')[0].getElementsByClassName('bruinwalk-card')[0].innerText.includes("No reviews for")) {
    let noReviewDiv = document.createElement('div').innerText("No review yet");
    popup.appendChild(noReviewDiv);
    popup.appendChild(document.createElement('br'));
  } else {
    let profReviewDiv = responseHTML.getElementsByClassName('review')[0];

    let reviewHeader = document.createElement('div');
    reviewHeader.style.display = 'flex';
    reviewHeader.style.justifyContent = 'space-around';

    let termTaken = document.createElement('div');
    termTaken.innerText = profReviewDiv.getElementsByClassName('term-taken')[0].innerText.split("\n")[2];
    if (profReviewDiv.getElementsByClassName('term-taken')[0].innerText.split("\n").length == 8) {
      let covid = document.createElement('div');
      covid.className = 'covid';
      covid.innerText = 'COVID-19';
      termTaken.appendChild(covid)
    }
    reviewHeader.appendChild(termTaken);

    let gradeReceived = document.createElement('div');
    let gradeReceived_text_splitted = profReviewDiv.getElementsByClassName('grade-received')[0].innerText.split('\n');
    gradeReceived.innerText = gradeReceived_text_splitted[1] + " " + gradeReceived_text_splitted[2];
    reviewHeader.appendChild(gradeReceived);
    popup.appendChild(reviewHeader);

    let review_comment = document.createElement('div');
    review_comment.innerText = profReviewDiv.getElementsByClassName('expand-area')[0].innerText;
    review_comment.className = "comment";
    review_comment.style.textAlign = "left";

    popup.appendChild(review_comment);
    popup.appendChild(document.createElement("br"));
  }

  //------------ attach bruinwalk link-----------------
  let bruinwalkLink = document.createElement('a');
  bruinwalkLink.className = "view-on-bwalk-a"
  bruinwalkLink.href = instUrl;
  bruinwalkLink.target = "_blank";
  bruinwalkLink.innerHTML = "View on BruinWalk";
  popup.appendChild(bruinwalkLink);
}

/**
 * Create button for each professor. Display "Overall" Bruinwalk metric rating on the button. 
 * If no such professor review on Bruinwalk, display "N/A" button instead.
 * 
 * @param {String} instUrl URL string of instructor on Bruinwalk who teaches the class
 * @param {HTMLCollection} instDiv DOM for injecting a popup button
 * @param {HTMLCollection} responseHTML Bruinwalk HTML page that contains professor's review
 * @param {String} id Unique id for a particular professor in a course
 * @returns {HTMLCollection} Button DOM if there exists review of the professor. Otherwise, NULL
 */
function createButton(instUrl, instDiv, responseHTML, id) {
  let bruinwalkPopupButton = document.createElement('button');

  // create 'N/A' button for professor whose review is not on bruinwalk
  if (instUrl == "" || responseHTML == "") {
    bruinwalkPopupButton.className = "bruinwalk-btn bruinwalk-undefined";
    bruinwalkPopupButton.innerText = "N/A";
    bruinwalkPopupButton.disabled = true;
    instDiv.appendChild(bruinwalkPopupButton);
    return null;
  }

  // show 'N/A' button to professor who has not received student metric score review
  if (responseHTML.getElementsByClassName('metric')[0] == null) {
    bruinwalkPopupButton.className = "bruinwalk-btn bruinwalk-undefined";
    bruinwalkPopupButton.innerText = "N/A";
    instDiv.appendChild(bruinwalkPopupButton);
    return null;
  }
  const overallRating = responseHTML.getElementsByClassName('metric')[0].innerText.match(/\d+.\d+/g);

  bruinwalkPopupButton.type = "button";
  bruinwalkPopupButton.className = "bruinwalk-btn popup bruinwalk-normal";
  bruinwalkPopupButton.id = id;
  bruinwalkPopupButton.innerText = overallRating;
  instDiv.appendChild(bruinwalkPopupButton);
  return bruinwalkPopupButton;
}

/**
 * Create a table that contains metric score for 5 categories on Bruinwalk of the instructor.
 * 
 * @param {Array<string>} metrics 5 metrics strings: Overall, Easiness, Workload, Clarity, Helpfulness
 * @param {HTMLCollection} responseHTML Bruinwalk HTML page that contains professor's review
 * @param {HTMLCollection} popup Div for injecting the table onto
 * @returns {Array<float>} Metrics scores from Bruinwalk page
 */
function createMetricsTable(metrics, responseHTML, popup) {
  // ------------ get professor metrics ----------------
  let prof_ratings_div = responseHTML.getElementsByClassName('metric');
  let metrics_score = [];
  for (let i = 0; i < prof_ratings_div.length; i++) {
    let numberPattern = /\d+.\d+/g;
    metrics_score.push(parseFloat(prof_ratings_div[i].innerText.match(numberPattern)));
  }

  // ----------------- create table of metrics onto popup----------------
  let table = document.createElement('table');
  table.className = "metricTable";
  for (let i = 0; i < 5; i++) {
    let row = document.createElement('tr');
    let metric = document.createElement('td');
    metric.innerHTML = metrics[i];
    row.appendChild(metric);

    let score = document.createElement('td');
    score.innerHTML = metrics_score[i];
    row.appendChild(score);

    table.appendChild(row);
  }
  popup.appendChild(table);
  popup.appendChild(document.createElement("br"));

  return metrics_score;
}

/**
 * Create radar chart of professor's 5 metrics scores and an average radar chart scores across 
 * all professors who teach the same course.
 * @param {Array<String>} metrics 5 metrics strings of Bruinwalk review category
 * @param {Array<float>} metrics_score Scores for each metric of Bruinwalk review
 * @param {String} professorName Professor name
 * @param {String} id Unique ID for creating a unique div
 * @param {String} cousename Abbreviation name of coursename
 * @param {Array<float>} averageResponse Average scores across professors who teach class
 * @returns {void}
 */
function createRadarChart(metrics, metrics_score, professorName, id, cousename, averageResponse) {
  let averageData = [];
  for (m of metrics) {
    averageData.push(averageResponse[m.toLowerCase()]);
  }
  let profMetricData = {
    labels: metrics,
    datasets: [{
      label: 'Intructor ' + professorName + ' in ' + cousename.toUpperCase(),
      data: metrics_score,
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }, {
      label: 'Average of instructors in ' + cousename.toUpperCase(),
      data: averageData,
      fill: true,
      backgroundColor: 'rgba(227, 217, 105, 0.2)',
      borderColor: 'rgba(227, 217, 105, 1)',
      pointBackgroundColor: 'rgba(227, 217, 105, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(227, 217, 105, 1)'
    }]
  };
  let radarOptions = {
    scale: {
      min: 0,
      max: 5,
    }
  }

  let radarChart = new Chart('metricRadar' + id, {
    type: 'radar',
    data: profMetricData,
    options: radarOptions
  });
}