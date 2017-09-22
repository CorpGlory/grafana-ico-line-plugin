import { d3SSelection } from './types';
import { RenderConfig } from 'render-config';


import * as d3 from 'd3';


export class Grid {
  private _renderConfig: RenderConfig;
  private _gTime: d3SSelection;
  private _gValue: d3SSelection;
  
  private _gGridValue: d3SSelection;
  private _gGridTime: d3SSelection;

  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;

    this._gGridValue = canvas.append("g");
    this._gGridValue.classed('grid', true);

    this._gGridTime = canvas.append("g");
    this._gGridTime.classed('grid', true)

    this._gTime = canvas.append("g");
    this._gTime.classed('axis x', true);
    this._gValue = canvas.append("g");
    this._gValue.classed('axis y', true);
  }

  public render() {
    if(this._gTime === undefined) {
      throw new Error('Group for time axis is undefined');
    }
    if(this._gValue === undefined) {
      throw new Error('Group for value axis is undefined');
    }

    this._gTime.selectAll().remove();
    this._gValue.selectAll().remove();

    this._gTime
      .attr("transform", `translate(0,${this._renderConfig.height})`)
      .call(d3.axisBottom(this._renderConfig.scaleTime));
    this._gValue
      .call(d3.axisLeft(this._renderConfig.scaleValue));

    this._gGridValue.selectAll().remove();

    var gridlinesV = d3
      .axisBottom(this._renderConfig.scaleTime)
      .tickSize(this._renderConfig.height)
      .tickFormat(() => '')

    var gridlinesH = d3
      .axisLeft(this._renderConfig.scaleValue)
      .tickSize(-this._renderConfig.width)
      .tickFormat(() => '')

    this._gGridValue.call(gridlinesV);
    this._gGridTime.call(gridlinesH);
  }

}