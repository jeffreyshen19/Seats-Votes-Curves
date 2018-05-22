drawCurve("AL");
drawHistoricalCurve("historical-gk-AL");
drawHistoricalCurve("historical-responsiveness-AL");
drawHistoricalCurve("historical-symmetry-AL");

function redrawCurves(){
  drawCurve(d3.select(".active").attr('id'));
  drawHistoricalCurve(d3.select(".active").attr('id'));
}
