function drawBarChart(data, x_column, y_column, x_datatype, y_datatype){
  d3.select("#mainchart").remove();
  console.log(x_datatype, y_datatype);
  var barSVG = d3.select("#chart-container").append("svg").attr("id", "mainchart").attr("width", 960).attr("height", 500),
         margin = {top: 20, right: 20, bottom: 30, left: 40},
         width = +barSVG.attr("width") - margin.left - margin.right,
         height = +barSVG.attr("height") - margin.top - margin.bottom,
         barSize = 100;
         g = barSVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        const brushedx = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.isTrusted) {
              var s = d3.event.selection || x2.range();
              var newXDomain, newYDomain;
              if(x_datatype == 'String'){
                this.brushRange = s;
                var eachBand = x2.step();
                var index1 = Math.round((s[0] / eachBand));
                var index2 = Math.round((s[1] / eachBand));
                newXDomain = x2.domain().slice(index1, index2);
                newYDomain = x.domain();
                x.domain(newXDomain);
              } else if (x_datatype == 'Number' || x_datatype == 'Date') {
                x.domain(s.map(x2.invert, x2));
                newXDomain = x.domain();
              }
              barSVG.select('.x.axis').call(d3.axisBottom(x));
              g.select("g")
                  .selectAll(".bar")
                  .style("visibility", function(d) {
                    if(x_datatype == 'String'){
                      return newXDomain.indexOf(d[x_column]) < 0? 'hidden': 'visible';
                    } else if (x_datatype == 'Number' || x_datatype == 'Date') {
                      return d[x_column] < newXDomain[0] || d[x_column] > newXDomain[1] ? 'hidden': 'visible';
                    }
                  })
                  .attr("width", x_datatype == 'String'? x.bandwidth(): width / data.length)
                  .attr("x", function(d) { return x(d[x_column]); })
                  .attr("y", function(d) { return y(d[y_column]); })
            }

        }

        const initBrushx = (brushRange) => {
          var s = brushRange || x2.range();
          var newXDomain, newYDomain;
          if(x_datatype == 'String'){
            this.brushRange = s;
            var eachBand = x2.step();
            var index1 = Math.round((s[0] / eachBand));
            var index2 = Math.round((s[1] / eachBand));
            newXDomain = x2.domain().slice(index1, index2);
            newYDomain = x.domain();
            x.domain(newXDomain);
          } else if (x_datatype == 'Number' || x_datatype == 'Date') {
            x.domain(s.map(x2.invert, x2));
            newXDomain = x.domain();
          }
          barSVG.select('.x.axis').call(d3.axisBottom(x));
          g.select("g")
              .selectAll(".bar")
              .style("visibility", function(d) {
                if(x_datatype == 'String'){
                  return newXDomain.indexOf(d[x_column]) < 0? 'hidden': 'visible';
                } else if (x_datatype == 'Number' || x_datatype == 'Date') {
                  return d[x_column] < newXDomain[0] || d[x_column] > newXDomain[1] ? 'hidden': 'visible';
                }
              })
              .attr("width", x_datatype == 'String'? x.bandwidth(): width / data.length)
              .attr("x", function(d) { return x(d[x_column]); })
              .attr("y", function(d) { return y(d[y_column]); })

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
         // The scale spacing the groups:
         var x = customScale[x_datatype]([0, width]);

         var x2 = customScale[x_datatype]([0, width]);
         var y = customScale[y_datatype]([height, 0]);










           x.domain(customeDomain[x_datatype](data, x_column));
           x2.domain(customeDomain[x_datatype](data, x_column));
           y.domain(customeDomain[y_datatype](data, y_column)).nice();
           console.log(customeDomain[x_datatype](data, x_column), customeDomain[y_datatype](data, y_column));
           var xTicks = width / barSize;
           const xBrushRange = [0, x_datatype == 'String'? x2.bandwidth() * xTicks: width / 4];
           var brushx = d3.brushX()
               .extent([
                 [0, 0],
                 [width, 10]
               ])
               .on("brush end", brushedx);

           g.append("g")
               .attr('class', 'all-rect-container')
               .selectAll("rect")
               .data(data)
               .enter().append("rect")
               .attr("class", "bar")
               .attr("x", function(d) { return x(d[x_column]); })
               .attr("y", function(d) { return y(d[y_column]); })
               .attr("width", x_datatype == 'String'? x.bandwidth(): width / data.length)
               .attr("height", function(d) { return height - y(d[y_column]); })
               .attr("fill", '#74cf8c');

           g.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x));

           g.append("g")
               .attr("class", "y axis")
               .call(d3.axisLeft(y).ticks(null, "s"))
               .append("text")
               .attr("x", 2)
               .attr("y", y(y.ticks().pop()) + 0.5)
               .attr("dy", "0.32em")
               .attr("fill", "#000")
               .attr("font-weight", "bold")
               .attr("text-anchor", "start")
               .text(y_column);



           var filtered = [];

           barSVG.append("g")
          .attr("class", "brush")
          .attr("id", "brushx")
          .attr("transform", "translate(" + 0 + "," + 0 + ")")
          .call(brushx)
          .call(brushx.move, xBrushRange)


          initBrushx(xBrushRange);


}
