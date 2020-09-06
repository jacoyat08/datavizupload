function drawPlotChart(data, x_column, y_column){
  // Size and color settings for the chart
  var totalWidth = 800;
  var totalheight = 600;
  var xTicks = 4;
  var margin = {top: 40, right: 30, bottom: 30, left: 50},
      width = totalWidth - margin.left - margin.right,
      height = totalheight - margin.top - margin.bottom;
  var barWidth = 40;
  var boxPlotColor = "#898989";
  var medianLineColor = "#ffffff";
  var axisColor = "#898989";

  d3.select("#mainchart").remove();

  // Setup the plotSVG and group we will draw the box plot in
  var plotSVG = d3.select("#chart-container")
  .append("svg")
  .attr("id", "mainchart")
  .attr("width", totalWidth)
  .attr("height", totalheight)
  .append("g")
  .attr("transform", "translate(" + (margin.left - barWidth) + "," + margin.top + ")");

  // Move axis to center align the bars with the xAxis ticks
  var yAxisBox = plotSVG.append("g").attr("transform", "translate(40,0)");
  var xAxisBox = plotSVG.append("g").attr("transform", "translate(40,0)");

  var groupCounts = { 'dataset': data};


  const brushedx = () => {

      if (d3.event.sourceEvent && d3.event.sourceEvent.isTrusted) {
        var s = d3.event.selection || x2Scale.range();
        this.brushRange = s;
        var eachBand = x2Scale.step();
        var index1 = Math.round((d3.event.selection[0] / eachBand));
        var index2 = Math.round((d3.event.selection[1] / eachBand));
        var newXDomain = x2Scale.domain().slice(index1, index2);
        xScale.domain(newXDomain);
        plotSVG.select('.x.axis').call(d3.axisBottom(xScale));
        g.selectAll(".verticalLines")
           .attr("x1", d => { return xScale(d.key) + barWidth/2; })
           .attr("y1", d =>  { return yScale(d.whiskers[0]); })
           .attr("x2", d =>  { return xScale(d.key) + barWidth/2; })
           .attr("y2", d => { return yScale(d.whiskers[1]); })
           .style("visibility", d => {
             return newXDomain.indexOf(d.key) < 0? 'hidden': 'visible';

           })


           g.selectAll("rect")
           .attr("x", d => { return xScale(d.key); })
           .attr("y", d => { return yScale(d.quartile[0]); })
           .style("visibility", d => {
             return newXDomain.indexOf(d.key) < 0? 'hidden': 'visible';

           })


      }


    }

  const initBrushx = (brushRange) => {
    console.log(brushRange)
    var s = brushRange || x2Scale.range();
    this.brushRange = s;
    var eachBand = x2Scale.step();
    var index1 = Math.round((s[0] / eachBand));
    var index2 = Math.round((s[1] / eachBand));
    var newXDomain = x2Scale.domain().slice(index1, index2);
    xScale.domain(newXDomain);
    plotSVG.select('.x.axis').call(d3.axisBottom(xScale));
    g.selectAll(".verticalLines")
       .attr("x1", d => { return xScale(d.key) + barWidth/2; })
       .attr("y1", d =>  { return yScale(d.whiskers[0]); })
       .attr("x2", d =>  { return xScale(d.key) + barWidth/2; })
       .attr("y2", d => { return yScale(d.whiskers[1]); })
       .style("visibility", d => {
         console.log(newXDomain.indexOf(d.key));
         return newXDomain.indexOf(d.key) < 0? 'hidden': 'visible';

       })


       g.selectAll("rect")
       .attr("x", d => { return xScale(d.key); })
       .attr("y", d => { return yScale(d.quartile[0]); })
       .style("visibility", d => {
          return newXDomain.indexOf(d.key) < 0? 'hidden': 'visible';
       })


       g.selectAll(".whiskers")
           .attr("x1", lineConfig.x1)
           .attr("y1", lineConfig.y1)
           .attr("x2", lineConfig.x2)
           .attr("y2", lineConfig.y2)

   }

  // Select all values into one Array for axis scaling (min/ max)
  // and sort group counts so quantile methods work
  var globalCounts = [];
  for (var key in groupCounts) {
      var groupCount = groupCounts[key].map(function(item){
        return item[y_column];
      });
      groupCounts[key] = groupCount.sort(sortNumber);
      groupCounts[key].forEach(element => {
          globalCounts.push(element);
      });
  }


  // Prepare the data for the box plots
  var plotData = [];
  var colorIndex = 0.1;
  var colorIndexStepSize = 0.08;
  for (var [key, groupCount] of Object.entries(groupCounts)) {

      var record = {};
      var localMin = d3.min(groupCount);
      var localMax = d3.max(groupCount);

      record["key"] = key;
      record["counts"] = groupCount;
      record["quartile"] = boxQuartiles(groupCount);
      record["whiskers"] = [localMax, localMin];
      record["color"] = d3.interpolateInferno(colorIndex);

      plotData.push(record);
      colorIndex += colorIndexStepSize;
  }


  // Create Tooltips
  var tip = d3.tip().attr('class', 'd3-tip').direction('e').offset([0,5])
      .html(function(d) {
          var content = "<span style='margin-left: 2.5px;'><b>" + d.key + "</b></span><br>";
          content +=`
              <table style="margin-top: 2.5px;">
                      <tr><td>Max: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[0]) + `</td></tr>
                      <tr><td>Q3: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[0]) + `</td></tr>
                      <tr><td>Median: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[1]) + `</td></tr>
                      <tr><td>Q1: </td><td style="text-align: right">` + d3.format(".2f")(d.quartile[2]) + `</td></tr>
                      <tr><td>Min: </td><td style="text-align: right">` + d3.format(".2f")(d.whiskers[1]) + `</td></tr>
              </table>
              `;
          return content;
      });
  plotSVG.call(tip);

  console.log(plotData);

  // Compute an ordinal xScale for the keys in plotData
  var xScale = d3.scalePoint()
  .domain(Object.keys(groupCounts))
  .rangeRound([0, width])
  .padding([0.5]);
  var x2Scale = d3.scalePoint()
  .domain(Object.keys(groupCounts))
  .rangeRound([0, width])
  .padding([0.5]);
  // Compute a global y scale based on the global counts
  var min = d3.min(globalCounts);
  var max = d3.max(globalCounts);
  var yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([min, max])
      .nice();
  const xBrushRange = [0, width];
  var brushx = d3.brushX()
      .extent([
        [0, 0],
        [width, 10]
      ])
      .on("brush end", brushedx);
  // Setup the group the box plot elements will render in
  var g = plotSVG.append("g")
  .attr("transform", "translate(20,0)");

  // Draw the box plot vertical lines
  var verticalLines = g.selectAll(".verticalLines")
  .data(plotData)
  .enter()
  .append("line")
  .attr("class", "verticalLines")
  .attr("x1", d => { return xScale(d.key) + barWidth/2; })
  .attr("y1", d =>  { return yScale(d.whiskers[0]); })
  .attr("x2", d =>  { return xScale(d.key) + barWidth/2; })
  .attr("y2", d => { return yScale(d.whiskers[1]); })
  .attr("stroke", boxPlotColor)
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "5,5")
  .attr("fill", "none");

  // Draw the boxes of the box plot, filled in white and on top of vertical lines
  var rects = g.selectAll("rect")
  .data(plotData)
  .enter()
  .append("rect")
  .attr("width", barWidth)
  .attr("height", d => { return yScale(d.quartile[2]) - yScale(d.quartile[0]); })
  .attr("x", d => { return xScale(d.key); })
  .attr("y", d => { return yScale(d.quartile[0]); })
  .attr("fill", d => { return d.color; })
  .attr("stroke", boxPlotColor)
  .attr("stroke-width", 1)
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

  // Config for whiskers and median
  var horizontalLineConfigs = [
  {   // Top whisker
      x1: d => { return xScale(d.key) },
      y1: d => { return yScale(d.whiskers[0]) },
      x2: d => { return xScale(d.key) + barWidth },
      y2: d => { return yScale(d.whiskers[0]) },
      color: boxPlotColor
  },
  {   // Median
      x1: d => { return xScale(d.key) },
      y1: d => { return yScale(d.quartile[1]) },
      x2: d => { return xScale(d.key) + barWidth },
      y2: d => { return yScale(d.quartile[1]) },
      color: medianLineColor
  },
  {   // Bottom whisker
      x1: d => { return xScale(d.key) },
      y1: d => { return yScale(d.whiskers[1]) },
      x2: d => { return xScale(d.key) + barWidth },
      y2: d => { return yScale(d.whiskers[1]) },
      color: boxPlotColor
  }
  ];

  // Draw the whiskers and median line
  for(var i=0; i < horizontalLineConfigs.length; i++) {
      var lineConfig = horizontalLineConfigs[i];
      var horizontalLine = g.selectAll(".whiskers")
          .data(plotData)
          .enter()
          .append("line")
          .attr("class", "whiskers")
          .attr("x1", lineConfig.x1)
          .attr("y1", lineConfig.y1)
          .attr("x2", lineConfig.x2)
          .attr("y2", lineConfig.y2)
          .attr("stroke", lineConfig.color)
          .attr("stroke-width", 1)
          .attr("fill", "none");
  }

  // add the Y gridlines
  plotSVG.append("g")
      .attr("transform", "translate(40,0)")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
          .tickSize(-width)
          .tickFormat("")
      )

  // Setup a scale on the left
  var yAxis = d3.axisLeft(yScale).ticks(6)
  yAxisBox.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Setup a series axis on the bottom
  var xAxis = d3.axisBottom(xScale);
  xAxisBox.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


    plotSVG.append("g")
     .attr("class", "brush")
     .attr("id", "brushx")
     .attr("transform", "translate(" + 0 + "," + 0 + ")")
     .call(brushx)
     .call(brushx.move, xBrushRange)


   initBrushx(xBrushRange);

  // Quartile definition
  function boxQuartiles(d) {
      return [
          d3.quantile(d, .75),
          d3.quantile(d, .5),
          d3.quantile(d, .25),
      ];
  }

  // Perform a numeric sort on an array
  function sortNumber(a,b) { return a - b; }

}
