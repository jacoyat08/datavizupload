//
//   // set up chart dimensions
// const cellSize = 60;
// const numBorough = 6;
// // set the dimensions and margins of the graph
// var margin = {top: 20, right: 20, bottom: 30, left: 50},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
//   // height = 400 - margin.right - margin.left;
//
// var heat_x = d3.scaleBand()
//     .range([0, width]);
//
// var heat_y = d3.scaleBand()
//     .range([height, 0]);
//
//
// const heatSVG = d3.select("#heatchart")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//
//   d3.csv("assets/csv/heat.csv").then(function(wide_data) {
//   var dataset = [];
//   wide_data.forEach( function(row) {
//     // Loop through all of the columns, and for each column
//     // make a new row
//     Object.keys(row).forEach( function(colname) {
//       // Ignore 'State' and 'Value' columns
//       if(colname == "Crime Type" || colname == "NoCrimes" || colname == "Year") {
//         return
//       }
//       dataset.push({"CrimeType": row["Crime Type"], "NoCrimes": row[colname], "Year": row["Year"], "Borough": colname});
//     });
//   })
//   dataset.forEach(function(d) {
//     d["NoCrimes"] = +d["NoCrimes"];
//     d.Year = +d.Year;});
//
//
//    var color = d3.scaleThreshold()
//        .domain(d3.range(2, 50, 4))
//        .range(d3.schemeBlues[9]);
//
//   // group data by years
//    var nest = d3.nest()
//      .key(function(d) { return d.Year; })
//      .entries(dataset);
//    // array of years in the data
//    console.log(nest);
//    var years = nest.map(function(d) { return d.key; });
//    var currentYearIndex = 0;
//    // create location dropdown menu
//   var yearMenu = d3.select("#yearDropdown");
//   yearMenu
//     .append("select")
//     .attr("id", "yearMenu")
//     .selectAll("option")
//       .data(years)
//       .enter()
//       .append("option")
//       .attr("value", function(d, i) { return i; })
//       .text(function(d) { return d; });
//
//   // function to create the initial heatmap
//    var drawHeatmap = function(year) {
//      // filter the data to return object of year of interest
//      var selectYear = nest.find(function(d) {
//        return d.key == year;
//      });
//
//     console.log(selectYear)
//     console.log(selectYear.values)
//
//     var x_elements = d3.set(dataset.map(function(d) { return d.CrimeType; } )).values(),
//         y_elements = d3.set(dataset.map(function(d) { return d.Borough; } )).values();
//
//     console.log(x_elements)
//     heat_y.domain(y_elements);
//     heat_x.domain(x_elements);
//
//
//
//     //draw the chart
//
//     heatSVG.selectAll("rect")
//      .data(selectYear.values)
//      .enter().append("rect")
//      .attr('class', 'cell')
//      .attr('width', cellSize)
//      .attr('height', cellSize)
//      .attr('x', d => heat_x(d.CrimeType))
//      //put the cells on top of the y increments to prevent x-axis labels overlapping
//      .attr('y', d => heat_y(d.Borough))
//      //set colors based on tuition
//      .style('fill', d => color(d.NoCrimes))
//      .style("stroke", "#d6cdb7");
//
//       // draw the axes
//
//     var xAxis = d3.axisBottom(heat_x);
//     var yAxis = d3.axisLeft(heat_y);
//       // .tickFormat(
//
//     heatSVG.append('g')
//         .classed('x axis', true)
//         .attr('transform', 'translate(0,' + height + ')')
//         .call(xAxis)
//
//
//     heatSVG.append('g')
//         .classed('y axis', true)
//         .call(yAxis)}
//   drawHeatmap(years[currentYearIndex]);
//
//   //Function to update heatmap
//   var updateHeatmap = function(year) {
//       console.log("currentYearIndex: " + currentYearIndex)
//       // filter data to return object of location of interest
//       var selectYear = nest.find(function(d) {
//          return d.key
//            == year;
//        });
//
//       // update the data and redraw heatmap
//       var heatmap = heatSVG.selectAll("rect")
//         .data(selectYear.values)
//         .transition()
//           .duration(500)
//           .style("fill", d => color(d.NoCrimes))
//     }
//     // run update function when dropdown selection changes
//   yearMenu.on("change", function() {
//     // find which location was selected from the dropdown
//     var selectedYear = d3.select(this)
//       .select("select")
//       .property("value");
//     currentYearIndex = +selectedYear;
//     // run update function with selected location
//     updateHeatmap(years[currentYearIndex]);
//   });
//
//
//       // Create Legend //
//       buckets = 9
//       var colorScale = d3.scaleQuantile()
//         // .domain([0, buckets - 1, d3.max(dataset, function (d) { return d.NoCrimes; })])
//         .domain([0, 4, 5, 7, 13, 23, 34, 44, 56])
//         .range(d3.schemeBlues[9]);
//
//       legendElementWidth = cellSize - 15;
//
//       var legend = heatSVG.selectAll(".legend")
//          .data([1].concat(colorScale.quantiles()), function(d) { return d; })
//          .enter()
//          .append("g")
//          .attr("class", "legend");
//
//      legend.append("rect")
//        .attr("x", function(d, i) { return legendElementWidth * i; })
//        .attr("y", height + 20)
//        .attr("width", legendElementWidth)
//        .attr("height", cellSize / 2)
//        .style("fill", d => colorScale(d));
//
//      legend.append("text")
//        .attr("class", "mono")
//        .text(function(d) { return "≥" + Math.round(d); })
//        .attr("x", function(d, i) { return legendElementWidth * i; })
//        .attr("y", height + cellSize);
//
//
//   });
