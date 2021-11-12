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
function showPopup(instUrl, instDiv, responseHTML) {

  // -------------- create button ----------------
  let bruinwalkPopupButton = document.createElement('button');
  // console.log(instUrl);

  // create 'N/A' button for professor whose review is not on bruinwalk
  if (instUrl == "" || responseHTML == "") {
    bruinwalkPopupButton.className = "bruinwalk-btn bruinwalk-undefined";
    bruinwalkPopupButton.innerText = "N/A";
    bruinwalkPopupButton.disabled = true;
    instDiv.appendChild(bruinwalkPopupButton);
    return;
  }

  const parts = instUrl.split("/");
  const id = parts[parts.length - 2];
  const professorName = responseHTML.getElementsByClassName('professor-info')[0].innerText.trim();

  // show 'N/A' button to professor who has not received student metric score review
  if (responseHTML.getElementsByClassName('metric')[0] == null) {
    console.log('no metric review yet');
    bruinwalkPopupButton.className = "bruinwalk-btn bruinwalk-undefined";
    bruinwalkPopupButton.innerText = "N/A";
    // note: clicking N/A refresh the page somehow
    instDiv.appendChild(bruinwalkPopupButton);
    return;
  }
  const overallRating = responseHTML.getElementsByClassName('metric')[0].innerText.match(/\d+.\d+/g);

  bruinwalkPopupButton.type = "button";
  bruinwalkPopupButton.className = "bruinwalk-btn popup bruinwalk-normal";
  bruinwalkPopupButton.id = id;
  bruinwalkPopupButton.innerText = overallRating;
  instDiv.appendChild(bruinwalkPopupButton);


  // ---------- create popup div that contains bruinwalk review and information
  let popup = document.createElement('div');
  popup.className = "popuptext";
  popup.id = "myPopup" + id;
  document.getElementById(id).appendChild(popup);

  // state === 0 -> user has not hover mouse onto the button. Freeze the popup when hover
  // state === 1 -> user has clicked the button. Hide the popup
  let state = 0;
  bruinwalkPopupButton.onmouseover = function () {
    if (state == 0) {
      let popupToggle = document.getElementById("myPopup" + id);
      popupToggle.classList.toggle("show");
      state = 1;
    }
  }
  bruinwalkPopupButton.onclick = function () {
    if (state == 1) {
      let popupToggle = document.getElementById("myPopup" + id);
      popupToggle.classList.toggle("show");
      state = 0;
    }
  };

  // ------------- add psuedo close popup (X mark)------------
  let titleDiv = document.createElement('div');
  titleDiv.className = 'bwalk-popup-title-div';
  titleDiv.innerHTML = id.toUpperCase();
  let closeX = document.createElement('div');
  closeX.innerText = "X";
  closeX.className = "bwalk-popup-title-close";
  titleDiv.appendChild(closeX);
  popup.appendChild(titleDiv);


  // ------------ get professor metrics ----------------
  let prof_ratings_div = responseHTML.getElementsByClassName('metric');
  let metrics = ['Overall', 'Easiness', 'Workload', 'Clarity', 'Helpfulness'];
  let metrics_score = [];
  for (let i = 0; i < prof_ratings_div.length; i++) {
    let rating = document.createElement('div');
    rating.innerHTML = prof_ratings_div[i].innerText;

    // still push an 'N/A' to array. Might remove later
    if (!(/\d/.test(prof_ratings_div[i].innerText))) {
      metrics_score.push(prof_ratings_div[i].innerText)
    }
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

  // ------------- create radar chart for 5 metrics---------------
  let chartDiv = document.createElement('canvas');
  chartDiv.className = "bruinwalk-radar-canvas";
  chartDiv.id = 'metricRadar' + id;
  popup.appendChild(chartDiv);

  let profMetricData = {
    labels: metrics,
    datasets: [{
      label: 'Intructor ' + professorName + ' in Class ' + id.toUpperCase(),
      data: metrics_score,
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }, {
      label: 'Average of instructors in class ' + id.toUpperCase(),
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

  let radarChart = new Chart('metricRadar' + id, {
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
}

// ----------- NOT FINISH -----------------
function findAverageMetrics(courseName) {
  let url = "https://www.bruinwalk.com/classes/" + courseName;
  // fetch website


  // check if there is next page or not. If yes, fetch again and store in array
  // else, return average
}