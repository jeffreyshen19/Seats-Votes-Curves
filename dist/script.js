var margin = {top: 40, right: 20, bottom: 60, left: 60};

var red = "#D64541",
    blue = "#446CB3";

function drawCurve(id){
  //Set width and height
  var width = d3.select(".body").node().offsetWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var e = document.getElementById("year-selecter");
  var year = e.options[e.selectedIndex].value;

  var checked = document.getElementById("toggle-eg-band").checked;

  d3.selectAll(".graph").classed("hidden", true).classed("active", false);

  //Scale from 0 to 100%
  var x = d3.scaleLinear().range([0, width]).domain([0, 100]);
  var y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

  //Make graph
  var tooltip = d3.select("#" + id).select(".tooltip");
  var mouseX;

  var dataset = d3.select("#" + id).node().dataset;

  d3.select("#" + id).select('svg').selectAll("*").remove(); //Clear all past graph drawings
  var svg = d3.select("#" + id).classed("hidden", false).classed("active", true).select("svg")
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
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
    .attr("class", "axis-label")
    .text("Percentage of Vote");

  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ,-20)")
    .attr("class", "axis-label")
    .text("Seats-Votes Curve for " + dataset.state + " in " + year);

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

  d3.csv("../data/seats-votes/" + year + "/" + id + ".csv", function(error, data){
    data.forEach(function(d){
      d.votesR = parseFloat(d.votesR);
      d.seatsR = parseFloat(d.seatsR);
      d.votesD = parseFloat(d.votesD);
      d.seatsD = parseFloat(d.seatsD);
    });

    //Set up lines
    var republicanLine = d3.line()
      .x(function(d) { return x(d.votesR); })
      .y(function(d) { return y(d.seatsR); });

    var democraticLine = d3.line()
      .x(function(d) { return x(d.votesD); })
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

    //Add idealized EG band
    if(checked){
      svg.append("polyline")
        .attr("points", x(17) + "," + y(0) + " " + x(33) + "," + y(0) + " " + x(83) + "," + y(100) + " " + x(67) + "," + y(100))
        .style("fill", "black")
        .style("fill-opacity", "0.3");
    }
  });
}

drawCurve("AL");

function redrawCurves(){
  drawCurve(d3.select(".active").attr('id'));
}
