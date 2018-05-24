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
