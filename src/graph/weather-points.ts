import { ModuleConfig } from '../module-config';
import { RenderConfig } from 'render-config';
import { d3SSelection } from './types';
import * as d3 from 'd3';
import { WeatherPoint, WeatherPointSet } from '../model/weather-series';

declare var grafanaBootData: any; 


export class WeatherPoints {

  private _g: d3SSelection;
  private _points: WeatherPointSet;
  private _renderConfig: RenderConfig;
  private _windColorScale: d3.ScaleLinear<string, string>;

  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    this._g = canvas.append('g');
    this._g.classed('gweatherPoints', true);
  }

  public setData(points: WeatherPointSet) {
    this._points = points;
  }

  public render() {
    
    var iconsDir = ModuleConfig.getInstance().pluginDirName + 'assets/';
    if(grafanaBootData.user.lightTheme) {
      iconsDir += 'weather-light';
    } else {
      iconsDir += 'weather-dark';
    }

    var items = this._g.selectAll('.wIco').data(this._points.points);

    items.enter()
      .append('g')
      .classed('wIco', true)
      .append('image')
      .attr('width', '50')
      .attr('height', '50')
      .attr('viewBox', '0 0 512 512')
      .attr('x', -25)
      .attr('y', -50)

    items.exit().remove();

    this._g.selectAll('.wIco').data(this._points.points)
      .attr('transform', (d: WeatherPoint) => {
        var x = this._renderConfig.scaleTime(d.timestamp);
        var y = 0;
        var res = "";
        res += `translate(${x}, ${y})`;
        return res;
      })
      .select('image')
      .attr(
        'xlink:href',
        (d: WeatherPoint) => iconsDir + `/${d.id}.svg`
      );
  }
}