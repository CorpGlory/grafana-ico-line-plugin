import { d3SSelection } from './types';
import { RenderConfig } from 'render-config';

import * as d3 from 'd3';

export class Grid {
  private _renderConfig: RenderConfig;
  private _gX: d3SSelection;
  private _gY: d3SSelection;
  private _gGridV: d3SSelection;
  private _gGridH: d3SSelection;

  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;

    this._gGridV = canvas.append("g");
    this._gGridV.classed('grid', true);

    this._gGridH = canvas.append("g");
    this._gGridH.classed('grid', true)

    this._gX = canvas.append("g");
    this._gX.classed('axis x', true);
    this._gY = canvas.append("g");
    this._gY.classed('axis y', true);
  }

  public render() {
    if(this._gX === undefined) {
      throw new Error('Group for X axis is undefined');
    }
    if(this._gY === undefined) {
      throw new Error('Group for Y axis is undefined');
    }

    this._gX.selectAll().remove();
    this._gY.selectAll().remove();

    this._gX
      .attr("transform", `translate(0,${this._renderConfig.height})`)
      .call(d3.axisBottom(this._renderConfig.x));

    this._gY
      .attr("transform", `translate(0,0)`)
      .call(d3.axisLeft(this._renderConfig.y));

    this._gGridV.selectAll().remove();

    var gridlinesV = d3
      .axisBottom(this._renderConfig.x)
      .tickSize(this._renderConfig.height)
      .tickFormat(() => '')

    var gridlinesH = d3
      .axisLeft(this._renderConfig.y)
      .tickSize(-this._renderConfig.width)
      .tickFormat(() => '')

    this._gGridV.call(gridlinesV);
    this._gGridH.call(gridlinesH);
  }

}