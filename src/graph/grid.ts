import { d3SSelection } from './types';
import { RenderConfig } from 'render-config';

import * as d3 from 'd3';

export class Grid {
  private _renderConfig: RenderConfig;
  private _gTime: d3SSelection;
  private _gWaves: d3SSelection;
  private _gSpeed: d3SSelection;
  
  private _gGridWaves: d3SSelection;
  private _gGridTime: d3SSelection;
  
  // private _labelLeft: d3SSelection;
  // private _labelRight: d3SSelection;

  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    
    // this._labelLeft = canvas.append('text')
    // this._labelLeft
    //   .text('Wave Height - Metres')
    //   .classed('gridLabel', true)
    //   .attr('text-anchor', 'middle');

    this._gGridWaves = canvas.append("g");
    this._gGridWaves.classed('grid', true);

    this._gGridTime = canvas.append("g");
    this._gGridTime.classed('grid', true)

    this._gTime = canvas.append("g");
    this._gTime.classed('axis x', true);
    this._gWaves = canvas.append("g");
    this._gWaves.classed('axis y', true);
    this._gSpeed = canvas.append("g");
    this._gSpeed.classed('axis y', true);

  }

  public render() {
    if(this._gTime === undefined) {
      throw new Error('Group for time axis is undefined');
    }
    if(this._gWaves === undefined) {
      throw new Error('Group for waves axis is undefined');
    }
    
    //this._labelLeft.attr('transform', `translate(-15, ${this._renderConfig.height / 2}) rotate(-90)`);

    this._gTime.selectAll().remove();
    this._gWaves.selectAll().remove();
    this._gSpeed.selectAll().remove();

    this._gTime
      .attr("transform", `translate(0,${this._renderConfig.height})`)
      .call(d3.axisBottom(this._renderConfig.scaleTime));
    this._gWaves
      .attr("transform", `translate(0,0)`)
      .call(d3.axisLeft(this._renderConfig.scaleWaves));
    this._gSpeed
      .attr("transform", `translate(${this._renderConfig.width},0)`)
      .call(d3.axisRight(this._renderConfig.scaleSpeed));

    this._gGridWaves.selectAll().remove();

    var gridlinesV = d3
      .axisBottom(this._renderConfig.scaleTime)
      .tickSize(this._renderConfig.height)
      .tickFormat(() => '')

    var gridlinesH = d3
      .axisLeft(this._renderConfig.scaleWaves)
      .tickSize(-this._renderConfig.width)
      .tickFormat(() => '')

    this._gGridWaves.call(gridlinesV);
    this._gGridTime.call(gridlinesH);
  }

}