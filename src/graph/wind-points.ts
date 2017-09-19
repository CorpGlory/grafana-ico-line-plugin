import { d3SSelection } from './types';
import { WindPoint, WindPointSet } from '../model/weather-series';


export class WindPoints {
  private _g: d3SSelection;
  constructor(canvas: d3SSelection) {
    this._g = canvas.append('g');
    this._g.classed('gwindPoints', true);
  }
  public render(windPoints: WindPointSet) {
    var items = this._g.selectAll('g').data(windPoints);
    items
      .enter()
        .append('text')
        .classed('arrowG', true)
      .merge(items)
        .text(d => d.direction.toString());
  }
}