/* eslint-disable object-shorthand */
/* global Chart, coreui, coreui.Utils.getStyle, coreui.Utils.hexToRgba */

/**
 * --------------------------------------------------------------------------
 * CoreUI Boostrap Admin Template (v3.2.0): main.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */

/* eslint-disable no-magic-numbers */
// Disable the on-canvas tooltip
Chart.defaults.global.pointHitDetectionRadius = 1
Chart.defaults.global.tooltips.enabled = false
Chart.defaults.global.tooltips.mode = 'index'
Chart.defaults.global.tooltips.position = 'nearest'
Chart.defaults.global.tooltips.custom = coreui.ChartJS.customTooltips
Chart.defaults.global.defaultFontColor = '#646470'
Chart.defaults.global.responsiveAnimationDuration = 1

document.body.addEventListener('classtoggle', event => {
  if (event.detail.className === 'c-dark-theme') {
    if (document.body.classList.contains('c-dark-theme')) {
      cardChart1.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--primary-dark-theme')
      cardChart2.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--info-dark-theme')
      Chart.defaults.global.defaultFontColor = '#fff'
    } else {
      cardChart1.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--primary')
      cardChart2.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--info')
      Chart.defaults.global.defaultFontColor = '#646470'
    }

    cardChart1.update()
    cardChart2.update()
    mainChart.update()
  }
})

// eslint-disable-next-line no-unused-vars
const cardChart1 = new Chart(document.getElementById('card-chart1'), {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: coreui.Utils.getStyle('--primary'),
        data: [65, 59, 84, 84, 51, 55, 40]
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent'
        }
      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 35,
          max: 89
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }
})

// eslint-disable-next-line no-unused-vars
const cardChart2 = new Chart(document.getElementById('card-chart2'), {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: coreui.Utils.getStyle('--info'),
        data: [1, 18, 9, 17, 34, 22, 11]
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent'
        }
      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: -4,
          max: 39
        }
      }]
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }
})

// eslint-disable-next-line no-unused-vars
const cardChart3 = new Chart(document.getElementById('card-chart3'), {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: [78, 81, 80, 45, 34, 12, 40]
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }
})

// eslint-disable-next-line no-unused-vars
const cardChart4 = new Chart(document.getElementById('card-chart4'), {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
        barPercentage: 0.6
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    }
  }
})
var svg = d3.select("#barchart"),
       margin = {top: 20, right: 20, bottom: 30, left: 40},
       width = +svg.attr("width") - margin.left - margin.right,
       height = +svg.attr("height") - margin.top - margin.bottom,
       g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // The scale spacing the groups:
   var x0 = d3.scaleBand()
       .rangeRound([0, width])
       .paddingInner(0.1);

   // The scale for spacing each group's bar:
   var x1 = d3.scaleBand()
       .padding(0.05);

   var y = d3.scaleLinear()
       .rangeRound([height, 0]);

   var z = d3.scaleOrdinal()
       .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

   d3.csv("assets/csv/bardata.csv", function(d, i, columns) {
       for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
       return d;
   }).then(function(data) {
       console.log(data);

       var keys = data.columns.slice(1);

       console.log('keys');
       console.log(keys);
       x0.domain(data.map(function(d) { return d.State; }));
       x1.domain(keys).rangeRound([0, x0.bandwidth()]);
       y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

       g.append("g")
           .selectAll("g")
           .data(data)
           .enter().append("g")
           .attr("class","bar")
           .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })
           .selectAll("rect")
           .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
           .enter().append("rect")
           .attr("x", function(d) { return x1(d.key); })
           .attr("y", function(d) { return y(d.value); })
           .attr("width", x1.bandwidth())
           .attr("height", function(d) { return height - y(d.value); })
           .attr("fill", function(d) { return z(d.key); });

       g.append("g")
           .attr("class", "axis")
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
           .text("Population");

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
           svg.select(".y")
               .transition()
               .call(d3.axisLeft(y).ticks(null, "s"))
               .duration(500);


           //
           // Filter out the bands that need to be hidden:
           //
           var bars = svg.selectAll(".bar").selectAll("rect")
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

   });
