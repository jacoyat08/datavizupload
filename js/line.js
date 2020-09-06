function drawLineChart(data, x_column, y_column, x_datatype, y_datatype){
  d3.select("#mainchart").remove();

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  const xTicks = 10;
  const customeDomain = {
    'String': (data, column) => {
      return data.map(function(d) { return d[column]; });
    },
    'Number': (data, column) => {
      return [0, d3.max(data, function(d) { return d[column] })];
    },
    'Date': (data, column) => {
      return [d3.min(data, function(d) { return d[column] }), d3.max(data, function(d) { return d[column] })];
    }
  }

  const customScale = {
     'String': (rangeRound) => {
       return d3.scaleBand().rangeRound(rangeRound).paddingInner(0.1);
     },
     'Number': (rangeRound) => {
       return d3.scaleLinear().rangeRound(rangeRound);
     },
     'Date': (rangeRound) => {
       return d3.scaleTime().range(rangeRound);
     }
   }


   const brushedx = () => {
       if (d3.event.sourceEvent && d3.event.sourceEvent.isTrusted) {
         var s = d3.event.selection || line_x2.range();
         var newXDomain, newYDomain, newData1, newData2;
         if(x_datatype == 'String'){
           this.brushRange = s;
           var eachBand = line_x2.step();
           var index1 = Math.round((s[0] / eachBand));
           var index2 = Math.round((s[1] / eachBand));
           newXDomain = line_x2.domain().slice(index1, index2);
           newYDomain = line_x.domain();
           line_x.domain(newXDomain);
           newData1 = data.slice(index1, index2);
         } else if (x_datatype == 'Number' || x_datatype == 'Date') {
           line_x.domain(s.map(line_x2.invert, line_x2));
           newXDomain = line_x.domain();
           newData1 = data;
         }


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
     var s = brushRange || x2.range();
     var newXDomain, newYDomain, newData1, newData2;
     if(x_datatype == 'String'){
       this.brushRange = s;
       var eachBand = line_x2.step();
       var index1 = Math.round((s[0] / eachBand));
       var index2 = Math.round((s[1] / eachBand));
       newXDomain = line_x2.domain().slice(index1, index2);
       newYDomain = line_x.domain();
       line_x.domain(newXDomain);
       newData1 = data.slice(index1, index2);
     } else if (x_datatype == 'Number' || x_datatype == 'Date') {
       line_x.domain(s.map(line_x2.invert, line_x2));
       newXDomain = line_x.domain();
       newData1 = data;
     }


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


  // set the ranges
  var line_x = customScale[x_datatype]([0, width]);
  var line_x2 = customScale[x_datatype]([0, width]);
  var line_y = customScale[y_datatype]([height, 0]);
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
            line_x.domain(customeDomain[x_datatype](data, x_column));
            line_x2.domain(customeDomain[x_datatype](data, x_column));
            line_y.domain(customeDomain[y_datatype](data, y_column));

            // Add the value_line_line path.
            lineSVG.append("path")
                .datum(data)
                .attr("class", "line1")
                .attr("d", value_line_line);



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
            const xBrushRange = [0, x_datatype == 'String'? line_x2.bandwidth() * xTicks: width / 4];
           lineSVG.append("g")
            .attr("class", "brush")
            .attr("id", "brushx")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .call(brushx)
            .call(brushx.move, xBrushRange)
          initBrushx(xBrushRange);

}
