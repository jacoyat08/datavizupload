function drawHistogram(data, x_column, bins, group){
  // set the dimensions and margins of the graph
  var grouped = _.groupBy(data, 'variable');
  var groups = Object.keys(grouped);
  groups.forEach((item, i) => {
    drawHistogramMain(grouped[item], x_column, bins, item);
  });


  function drawHistogramMain(data, x_column, bins, type){
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var keys = data.map((item) => {
      return item[x_column];
    })
    var x_domains = [_.min(keys), _.max(keys)];
    // set the ranges
    // set the ranges

    var x = d3.scaleLinear()
              .domain(x_domains)
              .range([0, width]);
    var y = d3.scaleLinear()
              .range([height, 0]);


    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d[x_column]; })
        .domain(x_domains)
        .thresholds(x.ticks(bins));
    d3.select("#mainchart-" + type).remove();
    // append the histogramSVG object to the body of the page
    // append a 'group' element to 'histogramSVG'
    // moves the 'group' element to the top left margin
    var histogramSVG = d3.select("#chart-container")
        .append("svg")
        .attr("id", "mainchart-" + type)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");



        // group the data for the bars
        var bins = histogram(data);

        // Scale the range of the data in the y domain
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);

        // append the bar rectangles to the histogramSVG element
        histogramSVG.selectAll("rect")
            .data(bins)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 1)
            .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style('fill', 'steelblue');

        // add the x Axis
        histogramSVG.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        histogramSVG.append("g")
            .call(d3.axisLeft(y));
  }

}
