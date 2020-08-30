function drawBarChart(data, x_column, y_column){
  d3.select("#mainchart").remove();
  var barSVG = d3.select("#chart-container").append("svg").attr("id", "mainchart").attr("width", 960).attr("height", 500),
         margin = {top: 20, right: 20, bottom: 30, left: 40},
         width = +barSVG.attr("width") - margin.left - margin.right,
         height = +barSVG.attr("height") - margin.top - margin.bottom,
         barSize = 100;
         g = barSVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        const brushedx = () => {

            if (d3.event.sourceEvent && d3.event.sourceEvent.isTrusted) {
              var s = d3.event.selection || x2.range();
              this.brushRange = s;
              var eachBand = x2.step();
              var index1 = Math.round((d3.event.selection[0] / eachBand));
              var index2 = Math.round((d3.event.selection[1] / eachBand));
              var newXDomain = x2.domain().slice(index1, index2);
              x0.domain(newXDomain);
              barSVG.select('.x.axis').call(d3.axisBottom(x0));
              g.select("g")
                  .selectAll("g")
                  .attr("transform", function(d) { return "translate(" + x0(d.x_column) + ",0)"; })
                  .style("visibility", function(d) {
                    return newXDomain.indexOf(d.x_column) < 0? 'hidden': 'visible';
                  })
                  .selectAll(".bar")
                  .attr("x", function(d) { return x1(d.key); })
                  .attr("y", function(d) { return y(d.value); })


            }


          }

        const initBrushx = (brushRange) => {
          var s = brushRange || x2.range();
          this.brushRange = s;
          var eachBand = x2.step();
          var index1 = Math.round((s[0] / eachBand));
          var index2 = Math.round((s[1] / eachBand));
          var newXDomain = x2.domain().slice(index1, index2);
          var newYDomain = x0.domain();
          x0.domain(newXDomain);
          barSVG.select('.x.axis').call(d3.axisBottom(x0));
          g.select("g")
              .selectAll("g")
              .style("visibility", function(d) {
                return newXDomain.indexOf(d.x_column) < 0? 'hidden': 'visible';
              })
              .attr("transform", function(d) { return "translate(" + x0(d.x_column) + ",0)"; })
              .selectAll(".bar")
              .attr("x", function(d) { return x1(d.key); })
              .attr("y", function(d) { return y(d.value); })

         }

     // The scale spacing the groups:
     var x0 = d3.scaleBand()
         .rangeRound([0, width])
         .paddingInner(0.1);

     // The scale for spacing each group's bar:
     var x1 = d3.scaleBand()
         .padding(0.05);
     var x2 = d3.scaleBand()
         .rangeRound([0, width])
         .paddingInner(0.1);
     var y = d3.scaleLinear()
         .rangeRound([height, 0]);




     var z = d3.scaleOrdinal()
         .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

         var groupedData = _.groupBy(data, x_column);
         var groupedKeys = Object.keys(groupedData);
         var data = groupedKeys.map((item, i) => {
           var obj = {};
           obj.x_column = item;
           obj[groupedData[item][0].variable] = groupedData[item][0][y_column];
           obj[groupedData[item][1].variable] = groupedData[item][1][y_column];
           return obj;
         });
           var columns = Object.keys(data[0]);

           var keys = columns.slice(1);
           x0.domain(data.map(function(d) { return d.x_column; }));
           x2.domain(data.map(function(d) { return d.x_column; }));
           x1.domain(keys).rangeRound([0, barSize]);
           y.domain([0, d3.max (data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();
           var xTicks = width / barSize;
           const xBrushRange = [0, x2.bandwidth() * xTicks];
           var brushx = d3.brushX()
               .extent([
                 [0, 0],
                 [width, 10]
               ])
               .on("brush end", brushedx);

           g.append("g")
               .attr('class', 'all-rect-container')
               .selectAll("g")
               .attr('class', 'rect-container')
               .data(data)
               .enter().append("g")
               .attr("class","bar")
               .attr("transform", function(d) { return "translate(" + x0(d.x_column) + ",0)"; })
               .selectAll("rect")
               .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
               .enter().append("rect")
               .attr("x", function(d) { return x1(d.key); })
               .attr("y", function(d) { return y(d.value); })
               .attr("width", x1.bandwidth())
               .attr("height", function(d) { return height - y(d.value); })
               .attr("fill", function(d) { return z(d.key); });

           g.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x0));

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

           var legend = g.append("g")
               .attr("font-family", "sans-serif")
               .attr("font-size", 10)
               .attr("text-anchor", "end")
               .selectAll("g")
               .data(keys.slice().reverse())
               .enter().append("g")
               .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

           legend.append("rect")
               .attr("x", width - 17)
               .attr("width", 15)
               .attr("height", 15)
               .attr("fill", z)
               .attr("stroke", z)
               .attr("stroke-width",2)
               .on("click",function(d) { update(d) });

           legend.append("text")
               .attr("x", width - 24)
               .attr("y", 9.5)
               .attr("dy", "0.32em")
               .text(function(d) { return d; });

           var filtered = [];

           barSVG.append("g")
          .attr("class", "brush")
          .attr("id", "brushx")
          .attr("transform", "translate(" + 0 + "," + 0 + ")")
          .call(brushx)
          .call(brushx.move, xBrushRange)


          initBrushx(xBrushRange);

           ////
           //// Update and transition on click:
           ////

           function update(d) {

               //
               // Update the array to filter the chart by:
               //

               // add the clicked key if not included:
               if (filtered.indexOf(d) == -1) {
                   filtered.push(d);
                   // if all bars are un-checked, reset:
                   if(filtered.length == keys.length) filtered = [];
               }
               // otherwise remove it:
               else {
                   filtered.splice(filtered.indexOf(d), 1);
               }

               //
               // Update the scales for each group(/states)'s items:
               //
               var newKeys = [];
               keys.forEach(function(d) {
                   if (filtered.indexOf(d) == -1 ) {
                       newKeys.push(d);
                   }
               })
               x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);
               y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { if (filtered.indexOf(key) == -1) return d[key]; }); })]).nice();

               // update the y axis:
               barSVG.select(".y")
                   .transition()
                   .call(d3.axisLeft(y).ticks(null, "s"))
                   .duration(500);


               //
               // Filter out the bands that need to be hidden:
               //
               var bars = barSVG.selectAll(".bar").selectAll("rect")
                   .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })

               bars.filter(function(d) {
                       return filtered.indexOf(d.key) > -1;
                   })
                   .transition()
                   .attr("x", function(d) {
                       return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;
                   })
                   .attr("height",0)
                   .attr("width",0)
                   .attr("y", function(d) { return height; })
                   .duration(500);

               //
               // Adjust the remaining bars:
               //
               bars.filter(function(d) {
                       return filtered.indexOf(d.key) == -1;
                   })
                   .transition()
                   .attr("x", function(d) { return x1(d.key); })
                   .attr("y", function(d) { return y(d.value); })
                   .attr("height", function(d) { return height - y(d.value); })
                   .attr("width", x1.bandwidth())
                   .attr("fill", function(d) { return z(d.key); })
                   .duration(500);


               // update legend:
               legend.selectAll("rect")
                   .transition()
                   .attr("fill",function(d) {
                       if (filtered.length) {
                           if (filtered.indexOf(d) == -1) {
                               return z(d);
                           }
                           else {
                               return "white";
                           }
                       }
                       else {
                           return z(d);
                       }
                   })
                   .duration(100);


           }
}
