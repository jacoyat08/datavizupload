function drawScatterChart(data, x_column, y_column){
  d3.select("#mainchart").remove();

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  const xTicks = 10;
  const brushedx = () => {

      if (d3.event.sourceEvent && d3.event.sourceEvent.isTrusted) {
        var s = d3.event.selection || x2.range();
        var eachBand = scatter_x2.step();
        var index1 = Math.round((s[0] / eachBand));
        var index2 = Math.round((s[1] / eachBand));
        var newXDomain = scatter_x2.domain().slice(index1, index2);

        scatter_x.domain(newXDomain);
        scatterSVG.select('.x.axis').call(d3.axisBottom(scatter_x));
        scatterSVG
            .selectAll("circle")
            .style("visibility", function(d) {
              return newXDomain.indexOf(d[x_column]) < 0? 'hidden': 'visible';
            })
            .attr("cx", function(d) { return scatter_x(d[x_column]); })
            .attr("cy", function(d) { return scatter_y(d[y_column]); })


      }


    }

  const initBrushx = (brushRange) => {
    var s = brushRange || scatter_x2.range();
    var eachBand = scatter_x2.step();
    var index1 = Math.round((s[0] / eachBand));
    var index2 = Math.round((s[1] / eachBand));
    var newXDomain = scatter_x2.domain().slice(index1, index2);

    scatter_x.domain(newXDomain);
    scatterSVG.select('.x.axis').call(d3.axisBottom(scatter_x));
    scatterSVG
        .selectAll("circle")
        .style("visibility", function(d) {
          return newXDomain.indexOf(d[x_column]) < 0? 'hidden': 'visible';
        })
        .attr("cx", function(d) { return scatter_x(d[x_column]); })
        .attr("cy", function(d) { return scatter_y(d[y_column]); })

   }
  // set the ranges
  var scatter_x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);
  var scatter_x2 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);
  var scatter_y = d3.scaleLinear().range([height, 0]);
  var scatter_z = d3.scaleOrdinal()
      .range(['#74cf8c', "#7d9cdb"])
      .domain(['income', 'rent']);
  // define the line
  var value_scatter_line = d3.line()
      .x(function(d) { return scatter_x(d[x_column]); })
      .y(function(d) { return scatter_y(d[y_column]); });

  // append the scatterSVG obgect to the body of the page
  // appends a 'group' element to 'scatterSVG'
  // moves the 'group' element to the top left margin
  var scatterSVG = d3.select("#chart-container").append("svg").attr("id", "mainchart").attr("width", 960).attr("height", 500)
       .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


              // format the data
              data.forEach(function(d) {
                  d[x_column] = d[x_column];
                  d[y_column] = +d[y_column];
              });

              // Scale the range of the data
              scatter_x.domain(data.map((d) => { return d[x_column] }));
              scatter_x2.domain(data.map((d) => { return d[x_column] }));
              scatter_y.domain([0, d3.max(data, function(d) { return d[y_column]; })]);

              // // Add the value_scatter_line path.
              // scatterSVG.append("path")
              //     .data([data])
              //     .attr("class", "line")
              //     .attr("d", value_scatter_line);

              // Add the scatterplot
              scatterSVG.selectAll("dot")
                  .data(data)
                .enter().append("circle")
                  .attr("r", 5)
                  .attr("cx", function(d) { return scatter_x(d[x_column]); })
                  .attr("cy", function(d) { return scatter_y(d[y_column]); })
                  .style("fill", function(d) {
                      return scatter_z(d.variable);
                  });
              // Add the X Axis
              scatterSVG.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(scatter_x));

              // Add the Y Axis
              scatterSVG.append("g")
                  .attr("class", "y axis")
                  .call(d3.axisLeft(scatter_y));
              var brushx = d3.brushX()
                  .extent([
                    [0, 0],
                    [width, 10]
                  ])
                  .on("brush end", brushedx);
              const xBrushRange = [0, scatter_x2.bandwidth() * xTicks];
              scatterSVG.append("g")
               .attr("class", "brush")
               .attr("id", "brushx")
               .attr("transform", "translate(" + 0 + "," + 0 + ")")
               .call(brushx)
               .call(brushx.move, xBrushRange)

                         initBrushx(xBrushRange);

}
