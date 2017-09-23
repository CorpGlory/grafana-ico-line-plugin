import { WindPoints } from './wind-points';
import { WeatherPoints } from './weather-points';
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
  private _back: d3SSelection;

  private _renderConfig: RenderConfig;
  private _grid: Grid;
  private _windPoints: WindPoints;
  private _weatherPoints: WeatherPoints;
  private _crossHair: Crosshair;

  private _crossHairVisible = false;

  private _mouseMoveHandler: (timestamp: number, panelRelY: number) => void;
  private _mouseOutHandler: () => void;

  constructor(element: HTMLElement, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
    this._holder = element;
    this._svg = d3.select(this._holder).append("svg");
    
    this._initCanvas();
    this._initBack();
    this._grid = new Grid(this._canvas, this._renderConfig);
    this._windPoints = new WindPoints(this._canvas, this._renderConfig);
    this._weatherPoints = new WeatherPoints(this._canvas, this._renderConfig);
    this._crossHair = new Crosshair(this._canvas, this._renderConfig);
  }

  public setData(weatherSerices: WeatherSeries) {
    this._windPoints.setData(weatherSerices.windPoints);
    this._weatherPoints.setData(weatherSerices.weatherPoints);
  }

  public render() {
    this._updateDimensions();
    this._renderBack();
    this._grid.render();
    this._windPoints.render();
    this._weatherPoints.render();
    this._crossHair.render();
    this._renderConfig.stop();
  }

  public showCrosshair(timestamp: number) {
    this._crossHair.show(timestamp);
  }

  public hideCrosshair() {
    this._crossHair.hide();
  }

  private _initBack() {
    this._back = this._canvas
      .append('rect');
    this._back
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'rgba(255,255,255,0)');
  }

  private _renderBack() {
    this._back.attr('width', this._renderConfig.width);
    this._back.attr('height', this._renderConfig.height);
  }

  private _updateDimensions() {
    if(this._renderConfig === undefined) {
      throw new Error('Render config is undefined');
    }

    var rectPos = this._holder.getBoundingClientRect();

    var width = rectPos.width;
    var height = rectPos.height;

    if(height <= 0) {
      throw new Error('Height can`t be less or equar zero');
    }

    this._renderConfig.graphX = rectPos.left + MARGIN.left;
    this._renderConfig.graphY = rectPos.top + MARGIN.top;

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
    this._canvas
      .on("mousemove", this._onMouseMove.bind(this))
      .on("mouseout", this._onMouseOut.bind(this));
  }

  private _onMouseMove() {
    var [x, y] = d3.mouse(this._canvas.node() as d3.ContainerElement);
    var panelRelY = y / this._renderConfig.height;
    var timestamp = this._renderConfig.scaleTime.invert(x).getTime();
    if(this._mouseMoveHandler !== undefined) {
      this._mouseMoveHandler(timestamp, panelRelY);
    }
  }

  public set mouseMoveHandler(value: (timestamp: number, panelRelY: number) => void) {
    this._mouseMoveHandler = value;
  }

  private _onMouseOut() {
    if(this._mouseOutHandler !== undefined) {
      this._mouseOutHandler();
    }
  }

  public set mouseOutHandler(value: () => void) {
    this._mouseOutHandler = value;
  }

}