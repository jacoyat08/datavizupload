//
// // set the dimensions and margins of the graph
// var margin = {top: 20, right: 20, bottom: 30, left: 50},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// // parse the date / time
// var parseTime = d3.timeParse("%d-%b-%y");
//
// // set the ranges
// var line_x = d3.scaleTime().range([0, width]);
// var line_y = d3.scaleLinear().range([height, 0]);
//
// // define the 1st line
// var value_line_line = d3.line()
//     .x(function(d) { return line_x(d.date); })
//     .y(function(d) { return line_y(d.close); });
//
// // define the 2nd line
// var value_line_line2 = d3.line()
//     .x(function(d) { return line_x(d.date); })
//     .y(function(d) { return line_y(d.open); });
//
// // append the lineSVG obgect to the body of the page
// // appends a 'group' element to 'lineSVG'
// // moves the 'group' element to the top left margin
// var lineSVG = d3.select("#linechart")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// // Get the data
// d3.csv("assets/csv/line.csv").then(function(data) {
//
//   // format the data
//   data.forEach(function(d) {
//       d.date = parseTime(d.date);
//       d.close = +d.close;
//       d.open = +d.open;
//   });
//
//   // Scale the range of the data
//   line_x.domain(d3.extent(data, function(d) { return d.date; }));
//   line_y.domain([0, d3.max(data, function(d) {
// 	  return Math.max(d.close, d.open); })]);
//
//   // Add the value_line_line path.
//   lineSVG.append("path")
//       .data([data])
//       .attr("class", "line")
//       .attr("d", value_line_line);
//
//   // Add the value_line_line2 path.
//   lineSVG.append("path")
//       .data([data])
//       .attr("class", "line")
//       .style("stroke", "red")
//       .attr("d", value_line_line2);
//
//   // Add the X Axis
//   lineSVG.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(line_x));
//
//   // Add the Y Axis
//   lineSVG.append("g")
//       .call(d3.axisLeft(line_y));
//
// });
