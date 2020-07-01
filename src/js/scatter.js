
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var scatter_x = d3.scaleTime().range([0, width]);
var scatter_y = d3.scaleLinear().range([height, 0]);

// define the line
var value_scatter_line = d3.line()
    .x(function(d) { return scatter_x(d.date); })
    .y(function(d) { return scatter_y(d.close); });

// append the scatterSVG obgect to the body of the page
// appends a 'group' element to 'scatterSVG'
// moves the 'group' element to the top left margin
var scatterSVG = d3.select("#scatterchart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("assets/csv/scatter.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
  });

  // Scale the range of the data
  scatter_x.domain(d3.extent(data, function(d) { return d.date; }));
  scatter_y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Add the value_scatter_line path.
  scatterSVG.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", value_scatter_line);

  // Add the scatterplot
  scatterSVG.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return scatter_x(d.date); })
      .attr("cy", function(d) { return scatter_y(d.close); });

  // Add the X Axis
  scatterSVG.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(scatter_x));

  // Add the Y Axis
  scatterSVG.append("g")
      .call(d3.axisLeft(scatter_y));

});
