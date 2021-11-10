function showPopup(instUrl, instDiv, responseHTML) {

    // create button
    var bruinwalkPopupButton = document.createElement('button');
    
    if (instUrl == null || responseHTML == null){
      bruinwalkPopupButton.className = "bruinwalk-undefined";
      bruinwalkPopupButton.innerText = "N/A";
      bruinwalkPopupButton.onclick = function() {};
      instDiv.appendChild(bruinwalkPopupButton);
      return;
    }

    const parts = instUrl.split("/");
    const id = parts[parts.length-2];
    const professorName = responseHTML.getElementsByClassName('professor-info')[0].innerText.trim();
    const overallRating = responseHTML.getElementsByClassName('metric')[0].innerText.match(/\d+.\d+/g);

    bruinwalkPopupButton.type = "button";
    bruinwalkPopupButton.className = "popup bruinwalk-button";
    bruinwalkPopupButton.id = id;
    bruinwalkPopupButton.innerText = overallRating;
    instDiv.appendChild(bruinwalkPopupButton);

    


    /*-----------prototype: bootstrap modal ----------*/
    /*
    $('body').append('\
      <!-- Modal -->\
<div class="modal fade" id="exampleModal'+id+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
          <span aria-hidden="true">&times;</span>\
        </button>\
      </div>\
      <div class="modal-body">\
        <canvas id="bar-chart" width="800" height="450"></canvas>\
        ...\
      </div>\
      <div class="modal-footer">\
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
        <button type="button" class="btn btn-primary">Save changes</button>\
      </div>\
    </div>\
  </div>\
</div>\
    ');

    new Chart(document.getElementById("bar-chart"), {
      type: 'bar',
      data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: [2478,5267,734,784,433]
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Predicted world population (millions) in 2050'
        }
      }
  });

  */
    
  var popup = document.createElement('div');
  popup.className = "popuptext";
  popup.id = "myPopup"+id;
  // popup.innerHTML = "POPUP!";
  document.getElementById(id).appendChild(popup);

  let state = 0; 

  bruinwalkPopupButton.onmouseover = function(){
    if (state==0){
      var popupToggle = document.getElementById("myPopup"+id);
      popupToggle.classList.toggle("show");
      state = 1;
    }
  }
  bruinwalkPopupButton.onclick = function(){
    if (state==1){
      var popupToggle = document.getElementById("myPopup"+id);
      popupToggle.classList.toggle("show");
      state = 0;
    }
    // console.log('should show now');
  };

// function clickFunction() {
  // if (state == 0){
  //   state = 1;
  // }
  // else{
  //   state = 0;
  //   var popup = document.getElementById("myPopup"+id);
  //   popup.classList.toggle("show");
  // }
  // var popupToggle = document.getElementById("myPopup"+id);
  // console.log(popup);
  // console.log(document.getElementsByClassName('popup'))
  // popupToggle.classList.toggle("show");
// }

    // get professor metrics
    var prof_ratings_div = responseHTML.getElementsByClassName('metric');
    var metrics = ['Overall','Easiness','Workload','Clarity','Helpfulness'];
    var metrics_score = [];
    for (var i=0; i < prof_ratings_div.length; i++){
      // console.log(prof_ratings_div[i].innerText);
      var rating = document.createElement('div');
      rating.innerHTML = prof_ratings_div[i].innerText;
      // document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(rating);

      // return if there is not a number (score) for this professor
      if(!(/\d/.test(prof_ratings_div[i].innerText))){
        metrics_score.push(prof_ratings_div[i].innerText)
      }
      
      var numberPattern = /\d+.\d+/g;
      metrics_score.push(parseFloat(prof_ratings_div[i].innerText.match(numberPattern)));

      // popup.appendChild(rating);
    }

    var table = document.createElement('table');
    table.className = "metricTable";
    for(var i = 0; i < 5; i++){
      var row = document.createElement('tr');
      var metric = document.createElement('td');
      metric.innerHTML = metrics[i];
      row.appendChild(metric);

      var score = document.createElement('td');
      score.innerHTML = metrics_score[i];
      row.appendChild(score);

      table.appendChild(row);
    }
    popup.appendChild(table);
    popup.appendChild(document.createElement("br"));

    // create radar chart
    var chartDiv = document.createElement('canvas');
    chartDiv.id = 'metricRadar'+id;
    popup.appendChild(chartDiv);

    var profMetricData = {
      labels: metrics,
      datasets:[{
        label: 'Intructor '+professorName+' in Class '+id.toUpperCase(),
        data: metrics_score,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      },{
      label: '[FAKE DATA] Average of instructors in class '+id.toUpperCase(),
      data: [3.0,3.0,3.0,3.0,3.0],
      fill: true,
      backgroundColor: 'rgba(227, 217, 105, 0.2)',
      borderColor: 'rgba(227, 217, 105, 1)',
      pointBackgroundColor: 'rgba(227, 217, 105, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(227, 217, 105, 1)'
      }]  
    };
    var radarOptions = {
        scale: {
            min: 0,
            max: 5,
        }
    }
    
    var radarChart = new Chart('metricRadar'+id, {
      type: 'radar',
      data: profMetricData,
      options: radarOptions
    });



    // create distribution
    var letterArray = ['A+', 'A', 'A-', 
    'B+', 'B', 'B-', 
    'C+', 'C', 'C-',
    'D+', 'D', 'D-', 
    'E+', 'E', 'E-', 'F']
    var gradeArray = [];
    var distribution = document.createElement('div');
    // NOTE: only get the most recent year
    for (var i=0; i<13; i++){
      // grade[i] = responseHTML.getElementsByClassName('tooltip left')[i].innerText;
      var grade = responseHTML.getElementsByClassName('bar-fill has-tip tip-left')[i].getAttribute('title');
      if (grade == null){
        console.log("THIS PROFESSOR HASN'T TAUGHT AT UCLA YET");
        return;
      }
      gradeArray.push(parseFloat(grade));
      distribution.innerHTML += letterArray[i] + ': ' + grade + '<br>';
    }
    // document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(distribution);
    // popup.appendChild(distribution);


    // create chart
    var chartDiv = document.createElement('canvas');
    chartDiv.id = 'distributionBar'+id;
    popup.appendChild(chartDiv);
    popup.appendChild(document.createElement("br"));

    //--------------testing getting average-------------
    var metric_dict = {
      'Overall':[],
      'Easiness':[],
      'Workload':[],
      'Clarity':[],
      'Helpfulness':[],
    }
    chrome.runtime.sendMessage({
      url: "https://www.bruinwalk.com/classes/com-sci-143/",
      contentScriptQuery: "getBruinwalkData",
      }
      , responseHTMLString => {
        // console.log(responseHTMLString);
        courseHtml = stringToHTML(responseHTMLString);
        ratingCells = (courseHtml.getElementsByClassName('rating-cell'));
        // console.log(ratingCells)

        // filter out only the desired div
        filteredRatingCells = []
        for (var i = 0; i <ratingCells.length; i++){
          if(ratingCells[i].width == "80px"){
            filteredRatingCells.push(ratingCells[i]);
          }
        }
        // console.log(filteredRatingCells);

        for (var i=0; i<filteredRatingCells.length; i++){
          // console.log(filteredRatingCells[i].innerText);
          if (filteredRatingCells[i].innerText != null){
            var text = filteredRatingCells[i].innerText;
            text = text.split('\n')
            if (text[1] != 'N/A'){
              // console.log(text[1])
            }
          }
        }
        filteredRatingCells.forEach(cell => {
          var text = cell.innerText.split('\n');
          if(text[1] != 'N/A'){
            metric_dict[text[2]].push(text[1]);
          }
        })

        // console.log(metric_dict['Overall']);
    })
    

    // get professor review
    var profReviewDiv = responseHTML.getElementsByClassName('review')[0];

    var reviewHeader = document.createElement('div');
    reviewHeader.style.display = 'flex';
    reviewHeader.style.justifyContent = 'space-around';

    var termTaken = document.createElement('div');
    termTaken.innerText = profReviewDiv.getElementsByClassName('term-taken')[0].innerText.split("\n")[2];
    if (profReviewDiv.getElementsByClassName('term-taken')[0].innerText.split("\n").length == 8){
      var covid = document.createElement('div');
      covid.className = 'covid';
      covid.innerText = 'COVID-19';
      termTaken.appendChild(covid)
    }
    reviewHeader.appendChild(termTaken);

    var gradeReceived = document.createElement('div');
    var gradeReceived_text_splitted = profReviewDiv.getElementsByClassName('grade-received')[0].innerText.split('\n');
    gradeReceived.innerText = gradeReceived_text_splitted[1] + " " + gradeReceived_text_splitted[2];
    reviewHeader.appendChild(gradeReceived);
    popup.appendChild(reviewHeader);

    var review_comment = document.createElement('div');
    review_comment.innerText = profReviewDiv.getElementsByClassName('expand-area')[0].innerText;
    review_comment.className = "comment";
    review_comment.style.textAlign = "left";
    //  document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(review);
    popup.appendChild(review_comment);
    popup.appendChild(document.createElement("br"));

    

    var profDistributionData = {
      // labels: letterArray,
      labels: ['+','A','-',
      '+','B','-',
      '+','C','-',
      '+','D','-',
      '+','E','-','F'],
      datasets:[{
        label: 'Grade Distribution from ' + responseHTML.getElementById('term-selector').children.item(1).innerText,
        data: gradeArray,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }]
    };
    var profDistributionOption = {
      scales: {
        y: {beginAtZero: true}
      }
    };

    var distributionChart = new Chart('distributionBar'+id,{
      type: 'bar',
      data: profDistributionData,
      options: profDistributionOption
    });



    var bruinwalkLink = document.createElement('a');
    bruinwalkLink.href = instUrl;
    bruinwalkLink.target = "_blank";
    bruinwalkLink.innerHTML = "Redirect to Bruinwalk";
    // document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(bruinwalkLink);
    popup.appendChild(bruinwalkLink);

}


function findAverageMetrics(courseName){
  var url = "https://www.bruinwalk.com/classes/" + courseName;
  // fetch website


  // check if there is next page or not. If yes, fetch again and store in array
  // else, return average
}