const moment = require('moment');
import * as $ from 'jquery';
import { RenderConfig } from './render-config';
import { WindPoint } from './model/weather-series';


export class Tooltip {

  private _dashboard: any;
  private _$tooltip: any;
  private _renderConfig: RenderConfig;
  private _isVisible = false;
  private _timeStamp: number;
  private _panelRelY: number;
  private _windPoint: WindPoint;

  constructor(dashboard: any, renderConfig: RenderConfig) {
    this._dashboard = dashboard;
    this._renderConfig = renderConfig;
    this._$tooltip = $('<div class="graph-tooltip">');
    this._$tooltip.hide();
  }

  public show(timestamp: number, panelRelY: number, windPoint: WindPoint) {
    this._timeStamp = timestamp;
    this._panelRelY = panelRelY;
    this._windPoint = windPoint;
    var x = this._renderConfig.scaleTime(timestamp) + this._renderConfig.graphX;
    var y = this._renderConfig.height * panelRelY + + this._renderConfig.graphY;
    var html = `
      <div class="graph-tooltip-time">
        ${this._getCurrentTimeFormatted(timestamp)}
      </div>
    `;
    html += `
      Direction: ${windPoint.direction} <br/>
      Speed: ${Math.round(windPoint.speed * 100) / 100}
    `
    this._$tooltip.show().html(html).place_tt(x + 20, y);
    this._isVisible = true;
  }

  public hide() {
    this._$tooltip.hide();
    this._isVisible = false;
  }
  
  public render() {
    if(!this.isVisible) {
      return;
    }
    this.show(this._timeStamp, this._panelRelY, this._windPoint);
  }
  
  public get isVisible() {
    return this._isVisible;
  }

  private _getCurrentTimeFormatted(timestamp: number) {
    // Format might be different
    // see https://github.com/grafana/grafana/blob/32f9a42d5e931be549ff9f169468b404af9a6b21/public/app/plugins/panel/graph/graph_tooltip.js#L212
    return this._dashboard.formatDate(moment(timestamp), 'YYYY-MM-DD HH:mm:ss.SSS');
  }
}