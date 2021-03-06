var margin = {top: 40, right: 20, bottom: 60, left: 60};

var red = "#D64541",
    blue = "#446CB3";

function drawDemonstrationCurve(id){
  var dataset = d3.select("#" + id).node().dataset;

  //Set width and height
  var width, height;
  if(dataset.half){
    width = (d3.select(".section").node().offsetWidth - 100) / 2 - margin.left - margin.right;
    height = d3.select("table").node().offsetHeight - margin.top - margin.bottom;
  }
  else{
    width = d3.select(".section").node().offsetWidth - 100 - margin.left - margin.right;
    height = 400 - margin.top - margin.bottom;
  }

  if(dataset.height) height = parseInt(dataset.height) - margin.top - margin.bottom;

  //Scale from 0 to 100%
  var x = d3.scaleLinear().range([0, width]).domain([0, 100]);
  var y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

  //Make graph
  var tooltip = d3.select("#" + id).select(".tooltip");
  var mouseX;

  d3.select("#" + id).select('svg').selectAll("*").remove(); //Clear all past graph drawings
  var svg = d3.select("#" + id).classed("hidden", false).select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Add x axis w/ label
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){return d + "%";}));

  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
    .attr("class", "axis-label")
    .text("Percentage of Vote");

  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ,-20)")
    .attr("class", "axis-label")
    .text(dataset.caption ? dataset.caption : "Seats-Votes Curve");

  //Add y axis w/ label
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d + "%";}));

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-label")
    .text("Percentage of Seats");

  d3.csv("./data/demo/" + id + ".csv", function(error, data){
    data.forEach(function(d){
      d.votes = parseFloat(d.votes);
      d.seatsR = parseFloat(d.seatsR);
      d.seatsD = parseFloat(d.seatsD);
    });

    if(dataset.dots){
      svg.selectAll(".dot-rep")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot-rep")
        .style("fill", red)
        .attr("cx", function(d){return x(d.votes);})
        .attr("cy", function(d){return y(d.seatsR);})
        .attr("r", 5);

      svg.selectAll(".dot-dem")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot-dem")
        .style("fill", blue)
        .attr("cx", function(d){return x(d.votes);})
        .attr("cy", function(d){return y(d.seatsD);})
        .attr("r", 5);
    }
    else{
      //Set up lines
      var republicanLine = d3.line()
        .x(function(d) { return x(d.votes); })
        .y(function(d) { return y(d.seatsR); });

      var democraticLine = d3.line()
        .x(function(d) { return x(d.votes); })
        .y(function(d) { return y(d.seatsD); });

      //Add both lines
      svg.append("path")
        .data([data])
        .style("stroke", red)
        .attr("class", "line")
        .attr("d", republicanLine);

      svg.append("path")
        .data([data])
        .style("stroke", blue)
        .attr("class", "line")
        .attr("d", democraticLine);
    }

    //Add gelman king 50-50 markers
    svg.append("line")
      .attr("x1", function(d){return x(0);})
      .attr("y1", function(d){return y(50);})
      .attr("x2", function(d){return x(100);})
      .attr("y2", function(d){return y(50);})
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("stroke-dasharray", "5,5");

    svg.append("line")
      .attr("x1", x(50))
      .attr("y1", y(0))
      .attr("x2", x(50))
      .attr("y2", y(100))
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("stroke-dasharray", "5,5");

  });
}
