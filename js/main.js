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
  d3.select('#slider-svg').remove();
  var xSelectField = document.getElementById('select_field_x').value;
  var ySelectField = document.getElementById('select_field_y').value;
  var xSelectFieldDataType = document.getElementById('select_field_x_datatype').value;
  var ySelectFieldDataType = document.getElementById('select_field_y_datatype').value;
  var chartType = document.getElementById('chart_type').value;
  var data = window.json_data.map((item) => {
    if(xSelectFieldDataType == 'Number'){
      item[xSelectField] = parseInt(item[xSelectField]);
    }
    if(ySelectFieldDataType == 'Number'){
      item[ySelectField] = parseInt(item[ySelectField]);
    }
    return item;
  });
  switch (chartType) {
    case "bar":
      drawBarChart(data, xSelectField, ySelectField, xSelectFieldDataType, ySelectFieldDataType);
      break;
    case "plot":
      drawPlotChart(data, xSelectField, ySelectField, xSelectFieldDataType, ySelectFieldDataType);
      break;
    case "scatter":
      drawScatterChart(data, xSelectField, ySelectField, xSelectFieldDataType, ySelectFieldDataType);
      break;
    case "line":
      drawLineChart(data, xSelectField, ySelectField, xSelectFieldDataType, ySelectFieldDataType);
      break;
    case "histogram":
      drawHistogram(data, xSelectField, xSelectFieldDataType);
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

  $('#chart_type').change(function(e){
    $('#diagram_type').text(`${e.target.value} chart`);
    $('#select_field_y').show();
    $('#label_field_y').show();
    $('#select_field_x').show();
    $('#label_field_x').show();
    $('#select_field_y_datatype').show();
    $('#label_field_y_datatype').show();
    $('#select_field_x_datatype').show();
    $('#label_field_x_datatype').show();
    if(e.target.value == 'histogram'){
      $('#select_field_y').hide();
      $('#label_field_y').hide();
      $('#select_field_y_datatype').hide();
      $('#label_field_y_datatype').hide();
      $('#select_field_x_datatype').hide();
      $('#label_field_x_datatype').hide();
    } else if (e.target.value == 'plot') {
      $('#select_field_x').hide();
      $('#label_field_x').hide();
      $('#select_field_y_datatype').hide();
      $('#label_field_y_datatype').hide();
      $('#select_field_x_datatype').hide();
      $('#label_field_x_datatype').hide();
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
