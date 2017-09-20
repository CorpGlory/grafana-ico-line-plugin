import { WindPoints } from './wind-points';
import { WeatherSeries } from 'model/weather-series';
import { Grid } from './grid';
import { Crosshair } from './crosshair';

import { d3HSelection, d3SSelection } from './types';
import { RenderConfig } from 'render-config';

import * as d3 from 'd3';


const MARGIN = { top: 20, right: 30, bottom: 20, left: 30 };


export class Graph {

  private _holder: HTMLElement;
  private _svg: d3HSelection;
  private _canvas: d3SSelection;

  private _renderConfig: RenderConfig;
  private _grid: Grid;
  private _windPoints: WindPoints;
  private _crossHair: Crosshair;
  
  private _crossHairVisible = false;

  constructor(element: HTMLElement, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    this._holder = element;
    this._svg = d3.select(this._holder).append("svg");
    this._initCanvas();
    this._grid = new Grid(this._canvas, this._renderConfig);
    this._windPoints = new WindPoints(this._canvas, this._renderConfig);
    this._crossHair = new Crosshair(this._canvas, this._renderConfig);
  }

  public setData(weatherSerices: WeatherSeries) {
    this._windPoints.setData(weatherSerices.windPoints);
  }

  public render() {
    this._updateDimensions();
    this._grid.render();
    this._windPoints.render();
    this._renderConfig.stop();
  }
  
  public showCrosshair() {
    this._crossHairVisible = true;
  }
  
  public hideCrosshair() {
    this._crossHairVisible = false;
    this._crossHair.hide();
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
  
  private _onMouseMove() {
    var x = d3.mouse(this._canvas.node() as d3.ContainerElement)[0];
    var timestamp = this._renderConfig.scaleTime.invert(x).getTime();
    this._crossHair.show(timestamp);
  }

}