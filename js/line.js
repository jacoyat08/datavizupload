function drawLineChart(data, x_column, y_column){
  d3.select("#mainchart").remove();
  var groupedData = _.groupBy(data, 'variable');
  console.log(groupedData);
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  const xTicks = 10;
  const brushedx = () => {

      if (d3.event.sourceEvent && d3.event.sourceEvent.isTrusted) {
        var s = d3.event.selection || x2.range();
        console.log(s);
        var eachBand = line_x2.step();
        var index1 = Math.round((s[0] / eachBand));
        var index2 = Math.round((s[1] / eachBand));
        var newXDomain = line_x2.domain().slice(index1, index2);
        var newData1 = groupedData.income.slice(index1, index2);
        var newData2 = groupedData.rent.slice(index1, index2);

        line_x.domain(newXDomain);
        lineSVG.select('.x.axis').call(d3.axisBottom(line_x));
        lineSVG
            .select(".line1")
            .datum(newData1)
            .attr("d", value_line_line);
        lineSVG
            .select(".line2")
            .datum(newData2)
            .attr("d", value_line_line);

      }


    }

  const initBrushx = (brushRange) => {
    console.log(brushRange);
    var s = brushRange || line_x2.range();
    var eachBand = line_x2.step();
    var index1 = Math.round((s[0] / eachBand));
    var index2 = Math.round((s[1] / eachBand));
    var newXDomain = line_x2.domain().slice(index1, index2);

    line_x.domain(newXDomain);
    lineSVG.select('.x.axis').call(d3.axisBottom(line_x));
    lineSVG
        .select(".line1")
        .attr("d", value_line_line);
    lineSVG
        .select(".line2")
        .attr("d", value_line_line);

   }
  // The scale for spacing each group's bar:
  var line_x = d3.scaleBand()
          .rangeRound([0, width])
          .padding(0.05);
  var line_x2 = d3.scaleBand()
          .rangeRound([0, width])
          .padding(0.05);
  var line_y = d3.scaleLinear().range([height, 0]);
  var line_z = d3.scaleOrdinal()
      .range(['#74cf8c', "#7d9cdb"])
      .domain(['income', 'rent']);
  // define the 1st line
  var value_line_line = d3.line()
      .x(function(d) { return line_x(d[x_column]); })
      .y(function(d) { return line_y(d[y_column]); });

  // define the 2nd line
  var value_line_line2 = d3.line()
      .x(function(d) { return line_x(d[x_column]); })
      .y(function(d) { return line_y(d[y_column]); });

  // append the lineSVG obgect to the body of the page
  // appends a 'group' element to 'lineSVG'
  // moves the 'group' element to the top left margin
  var lineSVG = d3.select("#chart-container").append("svg").attr("id", "mainchart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");



            // Scale the range of the data
            line_x.domain(groupedData.income.map((d) => { return d[x_column] }));
            line_x2.domain(groupedData.income.map((d) => { return d[x_column] }));
            line_y.domain([0, d3.max(groupedData.income, function(d) { return d[y_column]; })]);

            // Add the value_line_line path.
            lineSVG.append("path")
                .datum(groupedData.income)
                .attr("class", "line1")
                .attr("d", value_line_line);

            // Add the value_line_line2 path.
            lineSVG.append("path")
                .datum(groupedData.rent)
                .attr("class", "line2")
                .style("stroke", "red")
                .attr("d", value_line_line2);

            // Add the X Axis
            lineSVG.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(line_x));

            // Add the Y Axis
            lineSVG.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(line_y));
                var brushx = d3.brushX()
                    .extent([
                      [0, 0],
                      [width, 10]
                    ])
                    .on("brush end", brushedx);
           const xBrushRange = [0, line_x2.bandwidth() * xTicks];
           lineSVG.append("g")
            .attr("class", "brush")
            .attr("id", "brushx")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .call(brushx)
            .call(brushx.move, xBrushRange)
          initBrushx(xBrushRange);

}
