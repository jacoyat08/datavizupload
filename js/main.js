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
       console.log(window.json_data);


  };
  reader.readAsBinaryString(filefield.files[0]);

}

function onsubmit(){
  var xSelectField = document.getElementById('select_field_x').value;
  var ySelectField = document.getElementById('select_field_y').value;
  var chartType = document.getElementById('chart_type').value;
  var data = window.json_data.map((item) => {
    if(chartType == 'histogram'){
      item[xSelectField] = parseInt(item[xSelectField]);
    } else {
      item[ySelectField] = parseInt(item[ySelectField]);
    }
    return item;
  });
  switch (chartType) {
    case "bar":
      drawBarChart(data, xSelectField, ySelectField);
      break;
    case "plot":
      drawPlotChart(data, xSelectField, ySelectField);
      break;
    case "scatter":
      drawScatterChart(data, xSelectField, ySelectField);
      break;
    case "line":
      drawLineChart(data, xSelectField, ySelectField);
      break;
    case "histogram":
      drawHistogram(data, xSelectField, window.bins, 'income');
      break;
    default:

  }
}



$(document).ready(function () {
  $("#bins-control").hide();

  // Listen to submit event on the <form> itself!
  $('#selectfile').submit(function (e) {

    e.preventDefault();
    onsubmit();
  });

  $('#chart_type').change(function(e){
    $('#select_field_y').show();
    $('#label_field_y').show();
    $("#bins-control").hide();
    if(e.target.value == 'histogram'){
      $('#select_field_y').hide();
      $('#label_field_y').hide();
      window.bins = Math.round(window.json_data.length / 2);
      $("#bins-control").show();
      $( "#slider" ).slider(
        {
          change: function( event, ui ) {
            window.bins = ui.value;
            $('#slider_value').text(ui.value);
          },
          min: 0,
          value: Math.round(window.json_data.length / 2),
          max: Math.round(window.json_data.length / 2)
        }
      );
      $('#slider_min').text(0);
      $('#slider_value').text(Math.round(window.json_data.length / 2));
      $('#slider_max').text(Math.round(window.json_data.length / 2));
    }
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
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result; //JSON
}
