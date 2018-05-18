drawCurve("AL");

function redrawCurves(){
  drawCurve(d3.select(".active").attr('id'));
}
