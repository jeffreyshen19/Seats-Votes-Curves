var margin={top:40,right:20,bottom:60,left:60},red="#D64541",blue="#446CB3",scoreData={2000:null,2002:null,2004:null,2006:null,2008:null,2010:null,2012:null,2014:null,2016:null};function drawCurve(t){var e=d3.select(".body").node().offsetWidth-margin.left-margin.right,a=500-margin.top-margin.bottom,s=document.getElementById("year-selecter"),r=s.options[s.selectedIndex].value,n=document.getElementById("toggle-eg-band").checked;d3.selectAll(".graph").classed("hidden",!0).classed("active",!1);var o,l=d3.scaleLinear().range([0,e]).domain([0,100]),i=d3.scaleLinear().range([a,0]).domain([0,100]),c=d3.select("#"+t).select(".tooltip"),p=d3.select("#"+t).node().dataset;d3.select("#"+t).select("svg").selectAll("*").remove();var u=d3.select("#"+t).classed("hidden",!1).classed("active",!0).select("svg").attr("width",e+margin.left+margin.right).attr("height",a+margin.top+margin.bottom).on("mouseover",function(t){}).on("mousemove",function(t){(o=l.invert(d3.mouse(this)[0]-margin.left).toFixed(2))<0||o>100?c.classed("hidden",!0):c.classed("hidden",!1).html("At "+o+"% of vote:<br><br>").style("left",d3.mouse(this)[0]+20+"px").style("top",a-30+"px")}).on("mouseout",function(t){c.classed("hidden",!0)}).append("g").attr("transform","translate("+margin.left+","+margin.top+")");u.append("g").attr("transform","translate(0,"+a+")").call(d3.axisBottom(l).ticks(5).tickFormat(function(t){return t+"%"})),u.append("text").attr("transform","translate("+e/2+" ,"+(a+margin.top+10)+")").attr("class","axis-label").text("Percentage of Vote"),u.append("text").attr("transform","translate("+e/2+" ,-20)").attr("class","axis-label").text("Seats-Votes Curve for "+p.state+" in "+r),u.append("g").call(d3.axisLeft(i).ticks(5).tickFormat(function(t){return t+"%"})),u.append("text").attr("transform","rotate(-90)").attr("y",0-margin.left).attr("x",0-a/2).attr("dy","1em").attr("class","axis-label").text("Percentage of Seats"),d3.csv("../data/seats-votes/"+r+"/"+t+".csv",function(e,a){a.forEach(function(t){t.votes=parseFloat(t.votes),t.seatsR=parseFloat(t.seatsR),t.seatsD=parseFloat(t.seatsD)});var s=d3.line().x(function(t){return l(t.votes)}).y(function(t){return i(t.seatsR)}),o=d3.line().x(function(t){return l(t.votes)}).y(function(t){return i(t.seatsD)});if(u.append("path").data([a]).style("stroke",red).attr("class","line").attr("d",s),u.append("path").data([a]).style("stroke",blue).attr("class","line").attr("d",o),u.append("line").attr("x1",function(t){return l(0)}).attr("y1",function(t){return i(50)}).attr("x2",function(t){return l(100)}).attr("y2",function(t){return i(50)}).style("stroke","black").style("stroke-width","1").style("stroke-dasharray","5,5"),u.append("line").attr("x1",l(50)).attr("y1",i(0)).attr("x2",l(50)).attr("y2",i(100)).style("stroke","black").style("stroke-width","1").style("stroke-dasharray","5,5"),n&&u.append("polyline").attr("points",l(17)+","+i(0)+" "+l(33)+","+i(0)+" "+l(83)+","+i(100)+" "+l(67)+","+i(100)).style("fill","black").style("fill-opacity","0.3"),null==scoreData[""+r])d3.csv("../data/seats-votes-scores/"+r+".csv",function(e,a){scoreData[""+r]=[],a.forEach(function(e){e.state==t&&u.append("text").attr("x",10).attr("y",10).append("svg:tspan").attr("x",10).attr("dy",0).text("Partisan bias: "+parseFloat(e.gk_bias).toFixed(2)+"%").append("svg:tspan").attr("x",10).attr("dy",20).text("Symmetry: "+parseFloat(e.symmetry).toFixed(2)+"%").append("svg:tspan").attr("x",10).attr("dy",20).text("Responsiveness: "+parseFloat(e.responsiveness).toFixed(2)+"%"),scoreData[""+r].push({state:e.state,gk_bias:parseFloat(e.gk_bias).toFixed(2),symmetry:parseFloat(e.symmetry).toFixed(2),responsiveness:parseFloat(e.responsiveness).toFixed(2)})})});else for(var c=0;c<scoreData[""+r].length;c++)if(d=scoreData[""+r][c],d.state==t){u.append("text").attr("x",10).attr("y",10).append("svg:tspan").attr("x",10).attr("dy",0).text("Partisan bias: "+d.gk_bias+"%").append("svg:tspan").attr("x",10).attr("dy",20).text("Symmetry: "+d.symmetry+"%").append("svg:tspan").attr("x",10).attr("dy",20).text("Responsiveness: "+d.responsiveness+"%");break}})}function redrawCurves(){drawCurve(d3.select(".active").attr("id"))}drawCurve("AL");