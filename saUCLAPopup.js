/**
 * @file This file works on creating a bruinwalk review popup. It processes the instructor
 * url from bruinwalk.com and displays information on the popup. It also utilizes chart.js
 * to display chart and grade distribution
 * 
 * @author Nathakin "Ken" Leepreecha (KenNL42)
 */

/**
 * 
 * @param {string} instUrl Bruinwalk url of instructor who teaches the class
 * @param {HTMLCollection} instDiv HTML div element of instructor cell from class planner
 * @param {HTMLCollection} responseHTML HTML of bruinwalk page of instructor who teaches the class
 */
function showPopup(instUrl, instDiv, responseHTML, lectureNum) {
    const parts = instUrl.split("/");
    const id = parts[parts.length - 2] + '-' + lectureNum;

    // -------------- create button ----------------
    // return if N/A
    let bruinwalkPopupButton = createButton(instUrl, instDiv, responseHTML, id);
    if (!bruinwalkPopupButton) {
        return;
    };

/*
    const professorName = responseHTML.getElementsByClassName('professor-info')[0].innerText.trim();

    // ---------- create popup div that contains bruinwalk review and information
    let popup = document.createElement('div');
    popup.className = "popuptext";
    popup.id = "myPopup" + id;
    // instDiv.getElementById(id).appendChild(popup);
    // console.log(instDiv.getElementById("com-sci-m146-1"));
    // instDiv.appendChild(popup);
    document.getElementsByTagName('ucla-sa-soc-app')[0].shadowRoot.getElementById(id).appendChild(popup);


    // ------------- add title------------
    let titleDiv = document.createElement('div');
    titleDiv.className = 'bwalk-popup-title-div';
    titleDiv.innerHTML = id.toUpperCase();
    popup.appendChild(titleDiv);

    const metrics = ['Overall', 'Easiness', 'Workload', 'Clarity', 'Helpfulness'];

    // ------------ create metrics table and retrieve review metrics
    let metrics_score = createMetricsTable(metrics, responseHTML, popup);
    /*
    // ------------- create radar chart for 5 metrics---------------
    let radarChartDiv = document.createElement('canvas');
    radarChartDiv.className = "bruinwalk-radar-canvas";
    radarChartDiv.id = 'metricRadar' + id;
    popup.appendChild(radarChartDiv);
  
    let profMetricData = {
      labels: metrics,
      datasets: [{
        label: 'Intructor ' + professorName + ' in ' + id.toUpperCase(),
        data: metrics_score,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }, {
        label: 'Average of instructors in ' + id.toUpperCase(),
        data: [3.0, 3.0, 3.0, 3.0, 3.0],
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
  
    let radarChart = new Chart(document.getElementsByTagName('ucla-sa-soc-app')[0].shadowRoot.getElementById(radarChartDiv.id), {
      type: 'radar',
      data: profMetricData,
      options: radarOptions
    });
  
  
  
    // -------------- fetch distribution data --------------
  
    // case: no distribution yet:
    if (responseHTML.getElementsByClassName('distribution bruinwalk-card row')[0].innerText == "\n\nNo grades are available.\n") {
      console.log("no distribution yet");
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
          console.log("THIS PROFESSOR HASN'T TAUGHT AT UCLA YET");
          return;
        }
        gradeArray.push(parseFloat(grade));
      }
  
  
      // ---------- create distribution chart ---------------
      let distChartDiv = document.createElement('canvas');
      distChartDiv.id = 'distributionBar' + id;
      popup.appendChild(distChartDiv);
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
  
      let distributionChart = new Chart(document.getElementsByTagName('ucla-sa-soc-app')[0].shadowRoot.getElementById(distChartDiv.id), {
        type: 'bar',
        data: profDistributionData,
        options: profDistributionOption
      });
  
      // ------------- [Unfinished] Try to get average metrics across the class-------------
      let metric_dict = {
        'Overall': [],
        'Easiness': [],
        'Workload': [],
        'Clarity': [],
        'Helpfulness': [],
      }
      chrome.runtime.sendMessage({
        url: "https://www.bruinwalk.com/classes/com-sci-130/",
        contentScriptQuery: "getBruinwalkData",
      }, responseHTMLString => {
        courseHtml = stringToHTML(responseHTMLString);
        ratingCells = (courseHtml.getElementsByClassName('rating-cell'));
  
        // filter out only the desired div
        filteredRatingCells = []
        for (let i = 0; i < ratingCells.length; i++) {
          if (ratingCells[i].width == "80px") {
            filteredRatingCells.push(ratingCells[i]);
          }
        }
  
        for (let i = 0; i < filteredRatingCells.length; i++) {
          if (filteredRatingCells[i].innerText != null) {
            let text = filteredRatingCells[i].innerText;
            text = text.split('\n')
            if (text[1] != 'N/A') {
              // console.log(text[1])
            }
          }
        }
        filteredRatingCells.forEach(cell => {
          let text = cell.innerText.split('\n');
          if (text[1] != 'N/A') {
            metric_dict[text[2]].push(text[1]);
          }
        })
      })
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
    */

    // replace shadowRoot sheet
    let sheet = new CSSStyleSheet;
    sheet.replaceSync(`/* Popup container - can be anything you want */
    .popup {
      position: relative;
      display: inline-block;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* The actual popup */
    .popup .popuptext {
      visibility: hidden;
      background-color: rgb(248, 248, 248);
      color: rgb(100, 100, 100);
      text-align: center;
      border-radius: 6px;
      padding: 0 8px;
      z-index: 1;
      width: 320px;
      max-height: 90vh;
      overflow-y: overlay !important;
      box-shadow: 0 0 10px rgb(147, 169, 190);
    
      position: fixed;
      left: 70vw;
      top: 20px;
    
      /* position: absolute;
      left: 40px;
      top: -45vh; */
      transition: all .3s ease-in-out;
    
    }
    
    /* Toggle this class - hide and show the popup */
    .popup:hover .popuptext {
      visibility: visible;
      -webkit-animation: fadeIn 1s;
      animation: fadeIn 1s;
      z-index: 999;
    }
    
    .popup .popuptext:hover {
      visibility: visible;
      -webkit-animation: fadeIn 1s;
      animation: fadeIn 1s;
      z-index: 999;
    }
    
    /* Add animation (fade in the popup) */
    @-webkit-keyframes fadeIn {
      from {
        opacity: 0;
      }
    
      to {
        opacity: 1;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
    
      to {
        opacity: 1;
      }
    }
    
    .metricTable {
      margin: 0 auto;
    }
    
    /* .metricTable td {
      padding:0 30px 0 0;
    } */
    
    .metricTable tr:nth-child(even) {
      background-color: rgb(253, 253, 253);
    }
    
    .metricTable tr:nth-child(odd) {
      background-color: rgb(237, 247, 252);
    }
    
    .metricTable tr td:nth-child(1) {
      text-align: left;
      padding: 0 50px 0 20px;
    }
    
    .metricTable tr td:nth-child(2) {
      text-align: right;
      padding: 0 20px 0 50px;
    }
    
    .comment {
      white-space: normal;
      max-height: 100px;
      overflow-y: overlay;
      padding: 3px 16px;
    }
    
    /* Customized Scrollbar */
    ::-webkit-scrollbar {
      width: 20px;
    }
    
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: #d6dee1;
      border-radius: 20px;
      border: 6px solid transparent;
      background-clip: content-box;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: #a8bbbf;
    }
    
    .covid {
      border: 3px solid;
      border-radius: 16px;
      width: 80px;
      border-color: rgb(227, 217, 105);
      color: rgb(227, 217, 105);
      text-align: center;
    }
    
    .bruinwalk-btn {
      font-family: ProximaNova, Verdana, sans-serif;
    }
    
    .bruinwalk-normal {
      background-color: rgb(2, 117, 216);
      color: white;
      border-radius: 5px;
      border: none;
      width: 40px;
      height: 20px;
    }
    
    .bruinwalk-undefined {
      background-color: rgb(216, 34, 2);
      color: white;
      border-radius: 5px;
      border: none;
      width: 40px;
      height: 20px;
    }
    
    .instructor-container {
      display: flex;
      justify-content: space-between;
    }
    
    .bwalk-popup-title-div {
      text-align: center;
      position: relative;
      font-size: large;
      background-color: rgb(36,82,160);
      color: white;
      margin: 0 -8px 10px -8px;
      height: 32px;
      line-height: 32px;
      vertical-align: middle;
    }
    
    .bwalk-popup-title-close {
      margin-right: 10px;
      position: absolute;
      right: 0;
      top: 0;
      font-size: small;
    }
    
    .view-on-bwalk-a {
      appearance: button;
      height: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: rgba;
      font-size: medium;
      background-color: rgba(140, 140, 140, 0.461);
      margin: 10px -8px 0 -8px;
    }
    
    .bruinwalk-radar-canvas {
      margin: 10px;
    }`);
    document.getElementsByTagName('ucla-sa-soc-app')[0].shadowRoot.adoptedStyleSheets = [sheet];
}

// ----------- NOT FINISH -----------------
function findAverageMetrics(courseName) {
    let url = "https://www.bruinwalk.com/classes/" + courseName;
    // fetch website


    // check if there is next page or not. If yes, fetch again and store in array
    // else, return average
}

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
        console.log('no metric review yet');
        bruinwalkPopupButton.className = "bruinwalk-btn bruinwalk-undefined";
        bruinwalkPopupButton.innerText = "N/A";
        // note: clicking N/A refresh the page somehow
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