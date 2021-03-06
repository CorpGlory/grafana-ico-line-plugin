import { RenderConfig } from 'render-config';
import { d3SSelection } from './types';
import * as d3 from 'd3';
import { WindPoint, WindPointSet, WIND_DIRECTIONS_COUNT, WIND_SPEED_SCALES } from '../model/weather-series';


const WIND_SPEED_COLORS = [
  '#FFFFFF', '#CCFFFF', '#99FFCC', '#99FF99', '#99FF66',
  '#99FF00', '#CCFF00', '#FFFF00', '#FFCC00', '#FF9900',
  '#FF6600', '#FF3300', '#FF0000'
];


export class WindPoints {

  private _g: d3SSelection;
  private _points: WindPointSet;
  private _renderConfig: RenderConfig;
  private _windColorScale: d3.ScaleLinear<string, string>;

  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    this._g = canvas.append('g');
    this._g.classed('gwindPoints', true);
    this._windColorScale = d3.scaleLinear<string, string>()
      .domain(WIND_SPEED_SCALES)
      .range(WIND_SPEED_COLORS)
      .clamp(true);
  }

  public setData(points: WindPointSet) {
    this._points = points;
  }

  public render() {
    var items = this._g.selectAll('.arrowG').data(this._points.points);

    items.enter()
      .append('g')
      .classed('arrowG', true)
      .append('polygon')
      .attr('points', '94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153')
    
    items.exit()
      .remove();
    
    this._g.selectAll('.arrowG').data(this._points.points)
      .attr('transform', d => {
        var x = this._renderConfig.scaleTime(d.timestamp);
        var y = this._renderConfig.scaleValue(d.speed);
        var res = "";
        res += `translate(${x}, ${y})`;
        res += `rotate(${d.direction * 360 / WIND_DIRECTIONS_COUNT})`;
        res += 'scale(0.035)';
        res += "translate(-247.35,-153)";
        return res;
      })
      .select('polygon')
      .attr('fill', d => this._windColorScale(d.speed))
    
  }
}