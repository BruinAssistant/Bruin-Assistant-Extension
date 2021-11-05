function showPopup(instUrl, instDiv, responseHTML) {
    // var bruinwalkLink = document.createElement('a');
    // bruinwalkLink.href = instUrl;
    // bruinwalkLink.innerText = "Redirect to popup";
    // instDiv.appendChild(bruinwalkLink);

    var parts = instUrl.split("/");
    var id = parts[parts.length-2];
    // console.log(id);
    var bruinwalkPopupButton = document.createElement('button');
    bruinwalkPopupButton.type = "button";
    bruinwalkPopupButton.className = "btn btn-primary btn-sm modal-button";
    bruinwalkPopupButton.setAttribute("data-toggle", "modal");
    bruinwalkPopupButton.setAttribute("data-target", "#exampleModal"+id); // <-- change to a valid name?
    
    bruinwalkPopupButton.innerText = 'View Bruinwalk Review';
    instDiv.appendChild(bruinwalkPopupButton);

    // var tempModalDiv = document.createElement('div');
    // tempModalDiv.className = "modal fade text-center";
    // tempModalDiv.id = "exampleModal";

    // var modalDialog = document.createElement('div');
    // modalDialog.className = "modal-dialog";

    // var modalContent = document.createElement('div');
    // modalDialog.className = "modal-content";

    // modalDialog.appendChild(modalContent);
    // tempModalDiv.appendChild(modalDialog);
    // document.body.appendChild(tempModalDiv);
    $('body').append(
      '<div class="modal fade text-center" id="exampleModal'+id+'">\
        <div class="modal-dialog">\
          <div class="modal-content">\
          <div class="modal-header">\
    <h5 class="modal-title" id="exampleModalLabel">TITLE</h5>\
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
    <span aria-hidden="true">&times;</span>\
    </button>\
</div>\
<div class="modal-body">\
    <div class="rating"></div>\
    <div class="grade-distribution"></div>\
    <div class="review"></div>\
    <canvas id="chart"></canvas>\
</div>\
<div class="modal-footer">\
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
</div>\
          </div>\
        </div>\
      </div>'
    );
    // $('.modal-button').on('click', function(e){
    //   e.preventDefault();
    //   $('#exampleModal'+id).modal('show').find('.modal-content').load($(this).attr('href'));
    // });

    /* modaal library */
    /*
    // modal container div
    var containerDiv = document.createElement('div');
    containerDiv.innerHTML = '\
    <a href="#inline" class="inline">Show</a>;\
    <div id="inline" style="display:none;"></div>';
    instDiv.appendChild(containerDiv);
    

    var temp2 = document.createElement('div');
    temp2.innerHTML = '\
    <div>\
        <canvas id="myChart'+instUrl+'" height="600" width="600"></canvas>\
        <a href='+instUrl+'>Redirect to Bruinwalk</a>\
    </div>\
    ';
    document.getElementById('inline').appendChild(temp2);
    */
    /*-------end modaal library test------*/

    // $('.inline').modaal()
    // */

    //------------retrieve div of ratings------------

    // console.log(responseHTML.getElementsByClassName('metric'));
    // for(prof_ratings_div in responseHTML.getElementsByClassName('metric')){
    //   console.log(prof_ratings_div);
    // }

    // get professor metrics
    var prof_ratings_div = responseHTML.getElementsByClassName('metric');
    for (var i=0; i < prof_ratings_div.length; i++){
      // console.log(prof_ratings_div[i].innerText);
      var rating = document.createElement('div');
      rating.innerHTML = prof_ratings_div[i].innerText;
      document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(rating);
    }

    // get professor review
    var profReviewDiv = responseHTML.getElementsByClassName('review')[0];
    var review = document.createElement('div');
    review.innerText = profReviewDiv.getElementsByClassName('term-taken')[0].innerText
     + '\n' + profReviewDiv.getElementsByClassName('grade-received')[0].innerText
     + '\n' + profReviewDiv.getElementsByClassName('expand-area')[0].innerText;
     document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(review);


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
    document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(distribution);

    var bruinwalkLink = document.createElement('a');
    bruinwalkLink.href = instUrl;
    bruinwalkLink.innerText = "Redirect to Bruinwalk";
    document.getElementById("exampleModal"+id).getElementsByClassName('modal-body')[0].appendChild(bruinwalkLink);
}