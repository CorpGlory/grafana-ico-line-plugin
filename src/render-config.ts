import * as d3 from 'd3';
import { WIND_SPEED_SCALES } from './model/weather-series';

const DEFAULT_SPEED_LIMIT = WIND_SPEED_SCALES[Math.floor(WIND_SPEED_SCALES.length / 2)];

export class RenderConfig {
  public scaleTime: d3.ScaleTime<number, number> = d3.scaleTime();
  public scaleValue: d3.ScaleLinear<number, number> = d3.scaleLinear().domain([0, DEFAULT_SPEED_LIMIT]);

  public get width() {
    return this.scaleTime.range()[1];
  }

  public set width(value: number) {
    this.scaleTime.range([0, value]);
  }

  public get height() {
    return this.scaleValue.range()[0];
  }

  public set height(value: number) {
    this.scaleValue.range([value, 0]);
  }

  public set timeRange({ from, to }) {
    this.scaleTime.domain([new Date(from), new Date(to)]);
  }
  
  public set wavesLimit(to: Number | undefined) {
    var limit = to === undefined ? 100 : to;
    this.scaleValue.domain([0, limit]);
  }
  
  public set speedLimit(to: number | undefined) {
    var limit = to === undefined ? DEFAULT_SPEED_LIMIT : to;
    this.scaleValue.domain([0, limit]);
  }

  // changes state to end of rendering
  // it is used to track changed vars
  public stop() {
    // TODO: implement
  }
}