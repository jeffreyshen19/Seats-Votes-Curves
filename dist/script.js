var margin = {top: 40, right: 20, bottom: 60, left: 60};

var red = "#D64541",
    blue = "#446CB3";

var scoreData = {"2000": null, "2002": null, "2004": null, "2006": null, "2008": null, "2010": null, "2012": null, "2014": null, "2016": null};

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
  var thisElement = d3.select("#" + id);
  var tooltip = thisElement.select(".tooltip");
  var bisect = d3.bisector(function(datum) {
    return datum.votes;
  }).right;

  var mouse, mouseX, index, startDatum, endDatum, range, repVal, demVal, tooltipLine;

  var dataset = thisElement.node().dataset;

  thisElement.select('svg').selectAll("*").remove(); //Clear all past graph drawings

  d3.csv("../data/seats-votes/" + year + "/" + id + ".csv", function(error, data){
    data.forEach(function(d){
      d.votes = parseFloat(d.votes);
      d.seatsR = parseFloat(d.seatsR);
      d.seatsD = parseFloat(d.seatsD);
    });


    var svg = thisElement.classed("hidden", false).classed("active", true).select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("mousemove", function(){
        mouse = d3.mouse(this);
        mouseX = x.invert(mouse[0] - margin.left);
        index = bisect(data, mouseX);
        datum = data[index];

        redDot = thisElement.select(".red-dot");
        blueDot = thisElement.select(".blue-dot");
        tooltipLine = thisElement.select(".tooltip-line");

        if(index == 0){
          tooltip.classed("hidden", true);
          redDot.classed("hidden", true);
          blueDot.classed("hidden", true);
          tooltipLine.classed("hidden", true);
        }
        else{
          redDot.attr("cx", x(datum.votes))
            .attr("cy", y(datum.seatsR))
            .classed("hidden", false);

          blueDot.attr("cx", x(datum.votes))
            .attr("cy", y(datum.seatsD))
            .classed("hidden", false);

          tooltipLine.attr("x1", x(datum.votes))
            .attr("x2", x(datum.votes))
            .classed("hidden", false);

          tooltip.classed("hidden", false)
            .html("<strong>At " + datum.votes.toFixed(2) + "% of the Vote</strong>:<br>Republican Seat Share: " + datum.seatsR.toFixed(2) + "%<br>Democrat Seat Share: " + datum.seatsD.toFixed(2) + "%")
            .style("left", (20 + mouse[0] + tooltip.node().offsetWidth > thisElement.node().offsetWidth ? mouse[0] - 20 - tooltip.node().offsetWidth : mouse[0] + 20) + "px")
            .style("top", mouse[1] - 30 + "px");
        }
      })
      .on("mouseout", function(d){
        tooltip.classed("hidden", true);
        redDot.classed("hidden", true);
        blueDot.classed("hidden", true);
        tooltipLine.classed("hidden", true);
      })
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("circle")
      .attr("class", "red-dot hidden")
      .style("fill", red)
      .attr("r", 5);

    svg.append("circle")
      .attr("class", "blue-dot hidden")
      .style("fill", blue)
      .attr("r", 5);

    svg.append("line")
      .attr("class", "tooltip-line hidden")
      .attr("x1", x(0))
      .attr("y1", y(0))
      .attr("x2", x(0))
      .attr("y2", y(100))
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("stroke-dasharray", "5,5");

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
      .text("Percentage of Seats (" + dataset.districts + " seats total)");

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

    //Load score data
    if(scoreData["" + year] == null){
      d3.csv("../data/seats-votes-scores/" + year + ".csv", function(error, data){
        scoreData["" + year] = [];
        data.forEach(function(d){
          if(d.state == id){
            svg.append("text")
              .attr("x", 10)
              .attr("y", 10)
              .append("svg:tspan")
              .attr("x", 10)
              .attr("dy", 0)
              .text("Partisan bias: " + parseFloat(d.gk_bias).toFixed(2) + "%")
              .append("svg:tspan")
              .attr("x", 10)
              .attr("dy", 20)
              .text("Symmetry: " + parseFloat(d.symmetry).toFixed(2) + "%")
              .append("svg:tspan")
              .attr("x", 10)
              .attr("dy", 20)
              .text("Responsiveness: " + parseFloat(d.responsiveness).toFixed(2) + "%");
          }
          scoreData["" + year].push({"state": d.state, "gk_bias": parseFloat(d.gk_bias).toFixed(2), "symmetry": parseFloat(d.symmetry).toFixed(2), "responsiveness": parseFloat(d.responsiveness).toFixed(2)});
        });
      });
    }
    else{
      for(var i = 0; i < scoreData["" + year].length; i++){
        d = scoreData["" + year][i];
        if(d.state == id){
          svg.append("text")
            .attr("x", 10)
            .attr("y", 10)
            .append("svg:tspan")
            .attr("x", 10)
            .attr("dy", 0)
            .text("Partisan bias: " + d.gk_bias + "%")
            .append("svg:tspan")
            .attr("x", 10)
            .attr("dy", 20)
            .text("Symmetry: " + d.symmetry + "%")
            .append("svg:tspan")
            .attr("x", 10)
            .attr("dy", 20)
            .text("Responsiveness: " + d.responsiveness + "%");
          break;
        }
      }
    }

  });
}

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

  d3.csv("../data/demo/" + id + ".csv", function(error, data){
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

  d3.csv("../data/historical-results/" + title + "/" + state + ".csv", function(error, data){
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

drawCurve("AL");
drawHistoricalCurve("historical-gk-us");
drawHistoricalCurve("historical-responsiveness-us");
drawHistoricalCurve("historical-symmetry-us");
drawFigures();

function drawFigures(){
  drawDemonstrationCurve("step-1");
  drawDemonstrationCurve("step-2");
  drawDemonstrationCurve("step-3");
  drawDemonstrationCurve("step-4");
  drawDemonstrationCurve("not-symmetric");
  drawDemonstrationCurve("symmetric");
  drawDemonstrationCurve("proportional");
  drawDemonstrationCurve("incumbent-protection");
  drawDemonstrationCurve("winner-take-all");
  drawDemonstrationCurve("eg-optimized");
  drawDemonstrationCurve("partisan-bias");
  drawDemonstrationCurve("partisan-not-bias");
}

function redrawCurves(){
  drawCurve(d3.select(".active").attr('id'));
  drawHistoricalCurve(d3.select(".graph-historical-gk.active-historical").attr('id'));
  drawHistoricalCurve(d3.select(".graph-historical-symmetry.active-historical").attr('id'));
  drawHistoricalCurve(d3.select(".graph-historical-responsiveness.active-historical").attr('id'));
}

var resizeId;
d3.select(window).on('resize', function(){
  resizeId = setTimeout(function(){
    drawFigures();
    redrawCurves();
  }, 500);
});
