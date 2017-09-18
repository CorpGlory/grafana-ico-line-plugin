import { WeatherSeries } from 'model/weather-series';
import { Grid } from './grid';

import { d3HSelection, d3SSelection } from './types';
import { RenderConfig } from 'render-config';

import * as d3 from 'd3';


const MARGIN = { top: 20, right: 20, bottom: 50, left: 40 };


export class Graph {

  private _holder: HTMLElement;
  private _svg: d3HSelection;
  private _canvas: d3SSelection;

  private _renderConfig: RenderConfig;
  private _grid: Grid;

  constructor(element: HTMLElement, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    this._holder = element;
    this._svg = d3.select(this._holder).append("svg");
    this._initCanvas();
    this._grid = new Grid(this._canvas, this._renderConfig);
  }

  public updateData(weatherSerices: WeatherSeries) {
    
  }

  public render() {
    this._updateDimensions();
    this._grid.render();
  }

  private _updateDimensions() {
    if(this._renderConfig === undefined) {
      throw new Error('Render config is undefined');
    }

    var width = this._holder.clientWidth;
    var height = this._holder.clientHeight;

    if(height <= 0) {
      throw new Error('Height can`t be less or equar zero');
    }

    var newWidth = width - (MARGIN.left + MARGIN.right);
    var newHeight = height - (MARGIN.top + MARGIN.bottom);
    if(
      newWidth === this._renderConfig.width &&
      newHeight === this._renderConfig.height
    ) {
      return;
    }

    this._renderConfig.width = newWidth;
    this._renderConfig.height = newHeight;

    this._svg
      .attr("width", width)
      .attr("height", height);

  }

  private _initCanvas() {
    this._canvas = this._svg.append('g');
    this._canvas.classed('canvas', true);
    this._canvas.attr('transform', `translate(${MARGIN.left} ${MARGIN.top})`);
  }

  private _initSomething() {
    this._canvas
      .append("circle")
      .attr("cx", 25)
      .attr("cy", 25)
      .attr("r", 25)
      .style("fill", "purple");
  }

}