import { d3SSelection } from './types';
import { RenderConfig } from 'render-config';

export class Crosshair {

  private _renderConfig: RenderConfig;
  private _g: d3SSelection;
  private _line: d3SSelection;
  
  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    this._g = canvas.append('g');
    this._g.classed('crosshair', true);
  }
  
  public show(timestamp: number) {
    if(this._line === undefined) {
      this._line = this._g.append('line');
    }
    var x = this._renderConfig.scaleTime(timestamp);
    this._line
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
    this.render();
  }
  
  public render() {
    if(this._line !== undefined) {
      this._line.attr('y2', this._renderConfig.height)
    }
  }
  
  public hide() {
    this._line.remove();
    delete this._line;
  }
}