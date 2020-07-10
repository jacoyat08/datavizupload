function fileChosen(e){
  var filefield = document.getElementById('filefield');
  var xSelectField = document.getElementById('select_field_x');
  var ySelectField = document.getElementById('select_field_y');

  var reader = new FileReader();
  reader.onload = async function () {
      var json = await csvJSON(reader.result);
      var columns = Object.keys(json[0]);
      for (a in xSelectField.options) {
        xSelectField.options.remove(0);
      }
       columns.forEach((item, i) => {
         var opt = document.createElement('option');
         opt.value = item;
         opt.innerHTML = item;
         xSelectField.appendChild(opt);
       });

       columns.forEach((item, i) => {
         var opt = document.createElement('option');
         opt.value = item;
         opt.innerHTML = item;
         ySelectField.appendChild(opt);
       });

       window.json_data = json;

  };
  reader.readAsBinaryString(filefield.files[0]);

}

function onsubmit(){
  var xSelectField = document.getElementById('select_field_x').value;
  var ySelectField = document.getElementById('select_field_y').value;
  var chartType = document.getElementById('chart_type').value;

  switch (chartType) {
    case "bar":
      drawBarChart(window.json_data, xSelectField, ySelectField);
      break;
    case "plot":
      drawPlotChart(window.json_data, xSelectField, ySelectField);
      break;
    case "histogram":
      drawHistogram(window.json_data, xSelectField, ySelectField);
      break;
    default:

  }
}



$(document).ready(function () {
  // Listen to submit event on the <form> itself!
  $('#selectfile').submit(function (e) {

    e.preventDefault();
    onsubmit();
  });
});


function csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length - 1; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            if(headers[j] != 'name' && headers[j] != 'dtg' ){
              obj[headers[j]] = parseInt(currentline[j]);
            } else {
              obj[headers[j]] = currentline[j];
            }
        }
        result.push(obj);
    }
    return result; //JSON
}
