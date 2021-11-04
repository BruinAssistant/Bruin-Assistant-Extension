function showPopup(instUrl, instDiv) {
    // var bruinwalkLink = document.createElement('a');
    // bruinwalkLink.href = instUrl;
    // bruinwalkLink.innerText = "Redirect to bruinwalk";
    // instDiv.appendChild(bruinwalkLink);

    /* modaal library */
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

    /*-------end modaal library test------*/

    // temp.appendChild(temp2);

    // var temp3 = document.createElement('div');
    // temp3.innerText = "ABCD";
    // document.getElementById('inline').appendChild(temp);
    

    var data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Dataset #1",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 2,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [65, 59, 20, 81, 56, 55, 40],
        }]
      };
      
      var options = {
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            grid: {
              display: true,
              color: "rgba(255,99,132,0.2)"
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };
      
      new Chart('myChart'+instUrl, {
        type: 'bar',
        options: options,
        data: data
      });
      


    // $('.inline').modaal()
    // */
   
}