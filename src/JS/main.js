drawCurve("AL");
drawHistoricalCurve("historical-gk-AL");
drawHistoricalCurve("historical-responsiveness-AL");
drawHistoricalCurve("historical-symmetry-AL");
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

function redrawCurves(){
  drawCurve(d3.select(".active").attr('id'));
  drawHistoricalCurve(d3.select(".active-historical").attr('id'));
}
