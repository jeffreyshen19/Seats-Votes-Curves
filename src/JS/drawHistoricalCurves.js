var margin = {top: 40, right: 20, bottom: 60, left: 60};

function drawHistoricalCurve(id){
  var title = id.split("-")[1];
  var state = id.split("-")[2];

  //Make graph
  var thisElement = d3.select("#" + id);
  var tooltip = thisElement.select(".tooltip");

  var dataset = thisElement.node().dataset;

  //Set width and height
  var width = d3.select(".body").node().offsetWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  d3.selectAll(".graph-historical-" + title).classed("hidden", true).classed("active-historical", false);

  var domain = dataset.responsiveness ? [0, 10] : [-50, 50];

  //Scale from 0 to 100%
  var x = d3.scalePoint().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]).domain(domain);

  thisElement.select('svg').selectAll("*").remove(); //Clear all past graph drawings

  var dot, tooltipLine, mouse, mouseX;

  d3.csv("./data/historical-results/" + title + "/" + state + ".csv", function(error, data){
    data.forEach(function(d){
      d.y = parseFloat(d.y);
    });

    x.domain(data.map(function(d) { return d.year; }));
    x.invert = d3.scaleQuantize().domain(x.range()).range(x.domain());

    var svg = thisElement.classed("hidden", false).classed("active-historical", true).select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("mousemove", function(d){
        mouse = d3.mouse(this);
        mouseX = x.invert(mouse[0] - margin.left);
        index = 0;
        var datum;

        for(index = 0; index < data.length; index++) {
          if(data[index].year == mouseX) {
            datum = data[index];
            break;
          }
        }

        dot = thisElement.select(".dot");
        tooltipLine = thisElement.select(".tooltip-line");

        dot.attr("cx", x(datum.year))
          .attr("cy", y(datum.y))
          .classed("hidden", false);

        tooltipLine.attr("x1", x(datum.year))
          .attr("x2", x(datum.year))
          .classed("hidden", false);

        tooltip.classed("hidden", false)
          .html("<strong>In " + datum.year + "</strong>:<br>" + dataset.title + ": " + datum.y.toFixed(2) + "%")
          .style("left", (20 + mouse[0] + tooltip.node().offsetWidth > thisElement.node().offsetWidth ? mouse[0] - 20 - tooltip.node().offsetWidth : mouse[0] + 20) + "px")
          .style("top", mouse[1] - 30 + "px");
      })
      .on("mouseout", function(d){
        tooltip.classed("hidden", true);
        dot.classed("hidden", true);
        tooltipLine.classed("hidden", true);
      })
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("circle")
      .attr("class", "dot hidden")
      .style("fill", "black")
      .attr("r", 5);

    svg.append("line")
      .attr("class", "tooltip-line hidden")
      .attr("x1", x(0))
      .attr("y1", y(domain[0]))
      .attr("x2", x(0))
      .attr("y2", y(domain[1]))
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("stroke-dasharray", "5,5");

    //Add x axis w/ label
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
      .attr("class", "axis-label")
      .text("Year");

    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ,-20)")
      .attr("class", "axis-label")
      .text(dataset.title + " in " + dataset.state + " between 2000 - 2016");

    //Add y axis w/ label
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d + "%";}));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axis-label")
      .text(dataset.title);

    //Set up lines
    var line = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.y); });

    svg.append("path")
      .data([data])
      .style("stroke", "#2c3e50")
      .attr("class", "line")
      .attr("d", line);

    //Add line at 0
    svg.append("line")
      .attr("x1", function(d){return x("2000");})
      .attr("y1", function(d){return y(0);})
      .attr("x2", function(d){return x("2016");})
      .attr("y2", function(d){return y(0);})
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("stroke-dasharray", "5,5");
  });
}
