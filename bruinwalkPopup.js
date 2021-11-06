function showPopup(instUrl, instDiv, responseHTML) {
    // var bruinwalkLink = document.createElement('a');
    // bruinwalkLink.href = instUrl;
    // bruinwalkLink.innerText = "Redirect to popup";
    // instDiv.appendChild(bruinwalkLink);

    var parts = instUrl.split("/");
    const id = parts[parts.length-2];
    // console.log(id);
    var bruinwalkPopupButton = document.createElement('button');
    bruinwalkPopupButton.type = "button";
    bruinwalkPopupButton.className = "btn btn-primary btn-sm modal-button popup";
    bruinwalkPopupButton.id = id;
    // bruinwalkPopupButton.setAttribute("onclick", clickFunction());
    // bruinwalkPopupButton.setAttribute("data-toggle", "modal");
    // bruinwalkPopupButton.setAttribute("data-target", "#exampleModal"+id); // <-- change to a valid name?
    
    bruinwalkPopupButton.innerText = 'View Bruinwalk Review';
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

  var state = 0; 

  
  bruinwalkPopupButton.onclick = function(){
    var popupToggle = document.getElementById("myPopup"+id);
    popupToggle.classList.toggle("show");
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

      var numberPattern = /\d+.\d+/g;
      metrics_score.push(parseFloat(rating.innerHTML.match(numberPattern)));

      // return if there is not a number (score) for this professor
      if(!(/\d/.test(rating.innerHTML))){
        return;
      }
      popup.appendChild(rating);
    }

    // create radar chart
    var chartDiv = document.createElement('canvas');
    chartDiv.id = 'chart'+id;
    popup.appendChild(chartDiv);

    var data = {
      labels: metrics,
      datasets:[{
        label: 'professor A in class BBB-000',
        data: metrics_score,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    };
    var options = {
        scale: {
            min: 0,
            max: 5,
        }
    }
    
    var radarChart = new Chart('chart'+id, {
      type: 'radar',
      data: data,
      options: options
    });



    // get professor review
    var profReviewDiv = responseHTML.getElementsByClassName('review')[0];
    var review = document.createElement('div');
    review.innerText = profReviewDiv.getElementsByClassName('term-taken')[0].innerText
     + '\n' + profReviewDiv.getElementsByClassName('grade-received')[0].innerText
     + '\n' + profReviewDiv.getElementsByClassName('expand-area')[0].innerText;
    //  document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(review);
    popup.appendChild(review);


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
      // grade = grade.getAttribute('title'); <--- use regex instead
      if (grade == null){
        console.log("THIS PROFESSOR HASN'T TAUGHT AT UCLA YET");
        return;
      }
      // gradeArray.append(grade);
      distribution.innerHTML += letterArray[i] + ': ' + grade + '<br>';
    }
    // document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(distribution);
    popup.appendChild(distribution);

    var bruinwalkLink = document.createElement('a');
    bruinwalkLink.href = instUrl;
    bruinwalkLink.innerText = "Redirect to Bruinwalk";
    // document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(bruinwalkLink);
    popup.appendChild(bruinwalkLink);


    // create chart:

}