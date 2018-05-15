var margin = {top: 20, right: 20, bottom: 50, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var red = "#D64541",
    blue = "#446CB3";

function drawCurve(id){
  //Scale from 0 to 100%
  var x = d3.scaleLinear().range([0, width]).domain([0, 100]);
  var y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

  //Make graph
  var tooltip = d3.select("#" + id).select(".tooltip");
  var mouseX;

  d3.select("#" + id).select('svg').selectAll("*").remove(); //Clear all past graph drawings
  var svg = d3.select("#" + id).select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .on("mouseover", function(d){

    })
    .on("mousemove", function(d){
      mouseX = x.invert(d3.mouse(this)[0] - margin.left).toFixed(2);

      if(mouseX < 0 || mouseX > 100) tooltip.classed("hidden", true);
      else{
        tooltip.classed("hidden", false)
          .html("At " + mouseX + "% of vote:<br><br>")
          .style("left", d3.mouse(this)[0] + 20 + "px")
          .style("top", height - 30 + "px");
      }
    })
    .on("mouseout", function(d){
      tooltip.classed("hidden", true);
    })
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Add x axis w/ label
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){return d + "%";}));

  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    .attr("class", "axis-label")
    .text("Percentage of Vote");

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

  d3.csv("../data/seats-votes/" + id + "-rep.csv", function(error, data){
    data.forEach(function(d){
      d.votes = parseFloat(d.votes);
      d.seats = parseFloat(d.seats);
    });

    //Set up lines
    var republicanLine = d3.line()
      .x(function(d) { return x(d.votes); })
      .y(function(d) { return y(d.seats); });

    //Add both lines
    svg.append("path")
      .data([data])
      .style("stroke", red)
      .attr("class", "line")
      .attr("d", republicanLine);
  });

  d3.csv("../data/seats-votes/" + id + "-dem.csv", function(error, data){
    data.forEach(function(d){
      d.votes = parseFloat(d.votes);
      d.seats = parseFloat(d.seats);
    });

    var democraticLine = d3.line()
      .x(function(d) { return x(d.votes); })
      .y(function(d) { return y(d.seats); });

    svg.append("path")
      .data([data])
      .style("stroke", blue)
      .attr("class", "line")
      .attr("d", democraticLine);
  });
}
