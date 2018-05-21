drawCurve("AL");
drawHistoricalCurve("historical-gk-AL");

function redrawCurves(){
  drawCurve(d3.select(".active").attr('id'));
  drawHistoricalCurve(d3.select(".active").attr('id'));
}
