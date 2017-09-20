import { ModuleConfig } from '../module-config';
import { RenderConfig } from 'render-config';
import { d3SSelection } from './types';
import { WindPoint, WindPointSet, WIND_DIRECTIONS_COUNT } from '../model/weather-series';


export class WindPoints {

  private _g: d3SSelection;
  private _windPoints: WindPointSet;
  private _renderConfig: RenderConfig;

  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    this._g = canvas.append('g');
    this._g.classed('gwindPoints', true);
  }

  public setData(windPoints: WindPointSet) {
    this._windPoints = windPoints;
  }

  public render() {
    this._g.attr('transform', `translate(${0}, ${this._renderConfig.height})`);
    var items = this._g.selectAll('.arrowG').data(this._windPoints);
    
    var update = g => {
      g.attr('transform', (d: WindPoint) => {
        var x = this._renderConfig.x(d.timestamp);
        var y = -this._renderConfig.height / 2;
        var res = "";
        res += `translate(${x}, ${y})`;
        res += `rotate(${d.direction * 360 / WIND_DIRECTIONS_COUNT})`;
        res += "translate(-8,-5)"
        return res;
      })
    };
    
    items.enter()
      .append('g')
      .classed('arrowG', true)
      .call(update)
      .append('image')
      .attr('width', 10)
      .attr('height', 10)
      .attr('xlink:href', ModuleConfig.getInstance().pluginDirName + 'assets/arrow.svg')
    
    items.exit().remove();

    items.call(update);
    
  }
}