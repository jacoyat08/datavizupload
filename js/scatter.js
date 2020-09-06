function drawScatterChart(data, x_column, y_column, x_datatype, y_datatype){
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
         var s = d3.event.selection || scatter_x2.range();
         var newXDomain, newYDomain;
         if(x_datatype == 'String'){
           this.brushRange = s;
           var eachBand = scatter_x2.step();
           var index1 = Math.round((s[0] / eachBand));
           var index2 = Math.round((s[1] / eachBand));
           newXDomain = scatter_x2.domain().slice(index1, index2);
           newYDomain = scatter_x.domain();
           scatter_x.domain(newXDomain);
         } else if (x_datatype == 'Number' || x_datatype == 'Date') {
           scatter_x.domain(s.map(scatter_x2.invert, scatter_x2));
           newXDomain = scatter_x.domain();
         }

         scatterSVG.select('.x.axis').call(d3.axisBottom(scatter_x));
         scatterSVG
             .selectAll("circle")
             .style("visibility", function(d) {
               if(x_datatype == 'String'){
                 return newXDomain.indexOf(d[x_column]) < 0? 'hidden': 'visible';
               } else if (x_datatype == 'Number' || x_datatype == 'Date') {
                 return d[x_column] < newXDomain[0] || d[x_column] > newXDomain[1] ? 'hidden': 'visible';
               }
             })
             .attr("cx", function(d) { return scatter_x(d[x_column]); })
             .attr("cy", function(d) { return scatter_y(d[y_column]); })
       }

   }

   const initBrushx = (brushRange) => {
     var s = brushRange || x2.range();
     var newXDomain, newYDomain;
     if(x_datatype == 'String'){
       this.brushRange = s;
       var eachBand = scatter_x2.step();
       var index1 = Math.round((s[0] / eachBand));
       var index2 = Math.round((s[1] / eachBand));
       newXDomain = scatter_x2.domain().slice(index1, index2);
       newYDomain = scatter_x.domain();
       scatter_x.domain(newXDomain);
     } else if (x_datatype == 'Number' || x_datatype == 'Date') {
       scatter_x.domain(s.map(scatter_x2.invert, scatter_x2));
       newXDomain = scatter_x.domain();
     }


      scatterSVG.select('.x.axis').call(d3.axisBottom(scatter_x));
      scatterSVG
          .selectAll("circle")
          .style("visibility", function(d) {
            if(x_datatype == 'String'){
              return newXDomain.indexOf(d[x_column]) < 0? 'hidden': 'visible';
            } else if (x_datatype == 'Number' || x_datatype == 'Date') {
              return d[x_column] < newXDomain[0] || d[x_column] > newXDomain[1] ? 'hidden': 'visible';
            }
          })
          .attr("cx", function(d) { return scatter_x(d[x_column]); })
          .attr("cy", function(d) { return scatter_y(d[y_column]); })

    }


  // set the ranges
  var scatter_x = customScale[x_datatype]([0, width]);
  var scatter_x2 = customScale[x_datatype]([0, width]);
  var scatter_y = customScale[y_datatype]([height, 0]);

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




              // Scale the range of the data
              scatter_x.domain(customeDomain[x_datatype](data, x_column));
              scatter_x2.domain(customeDomain[x_datatype](data, x_column));
              scatter_y.domain(customeDomain[y_datatype](data, y_column));

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
                  .style("fill", '#74cf8c');
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
                  const xBrushRange = [0, x_datatype == 'String'? scatter_x2.bandwidth() * xTicks: width / 4];
              scatterSVG.append("g")
               .attr("class", "brush")
               .attr("id", "brushx")
               .attr("transform", "translate(" + 0 + "," + 0 + ")")
               .call(brushx)
               .call(brushx.move, xBrushRange)

                         initBrushx(xBrushRange);

}
