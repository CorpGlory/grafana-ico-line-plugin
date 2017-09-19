import { RenderConfig } from 'render-config';
import { d3SSelection } from './types';
import { WindPoint, WindPointSet } from '../model/weather-series';


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
    var items = this._g.selectAll('g').data(this._windPoints);
    items
      .enter()
        .append('text')
        .classed('arrowG', true)
      .merge(items)
        .text(d => d.direction.toString());
  }
}