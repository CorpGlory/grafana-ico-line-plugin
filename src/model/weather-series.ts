// TODO: WeatherPointSet and WindPointSet common parent class
// TODO: findPoint via binary search


import * as _ from 'lodash';


export const WIND_DIRECTIONS_COUNT = 16;

// order must be clockwise
// https://cdn.windfinder.com/prod/images/help/wind_directions.9d696e7e.png
export enum WindDirection {
  N, NNE, NE, ENE, E, ESE, SE, SSE,
  S, SSW, SW, WSW, W, WNW, NW, NNW
}

// https://en.wikipedia.org/wiki/Beaufort_scale
// converting miles per hour to meters per second in the end
export const WIND_SPEED_SCALES = [0, 1, 4, 8, 13, 18, 25, 31, 39, 47, 55, 64, 73].map(m => m * 0.44704);

export class WindPoint {
  public timestamp: number;
  public direction: WindDirection;
  public speed: number; // mph
  public constructor(timestamp: number, direction: string, speed: number) {
    if(timestamp === undefined) {
      throw new Error('timestamp is undefined');
    }
    if(direction === undefined) {
      throw new Error('direction is undefined');
    }
    if(speed === undefined) {
      throw new Error('speed is undefined');
    }
    this.timestamp = timestamp;
    this.direction = WindDirection[direction];
    this.speed = speed;
  }
}

export class WindPointSet {
  private _points: WindPoint[];
  constructor(points: WindPoint[]) {
    this._points = points;
  }
  public set points(value: WindPoint[]) {
    this._points = value;
  }
  public get points(): WindPoint[] {
    return this._points;
  }
  public findPoint(timestamp: number): WindPoint | undefined {
    var minDist = Number.POSITIVE_INFINITY;
    var res: WindPoint | undefined = undefined;
    for(var i = 0; i < this._points.length; i++) {
      var point = this._points[i];
      var dist = timestamp - point.timestamp;
      if(dist > 0 && dist < minDist) {
        dist = minDist;
        res = point;
      }
    }
    return res;
  }
  public getMaxSpeedLimit(): number | undefined {
    return _.max(this._points.map(s => s.speed));
  }
}

export class WeatherPoint {
  public timestamp: number;
  public id: number;
  constructor(timestamp: number, id: number) {
    if(id <= 0 || id > 47) {
      throw new Error('Weather must be in interval [1, 47]');
    }
    this.timestamp = timestamp;
    this.id = id;
  }
}

export class WeatherPointSet {
  private _points: WeatherPoint[];
  constructor(points: WeatherPoint[]) {
    this._points = points;
  }
  public set points(value: WeatherPoint[]) {
    this._points = value;
  }
  public get points(): WeatherPoint[] {
    return this._points;
  }
  public findPoint(timestamp: number): WeatherPoint | undefined {
    var minDist = Number.POSITIVE_INFINITY;
    var res: WeatherPoint | undefined = undefined;
    for(var i = 0; i < this._points.length; i++) {
      var point = this._points[i];
      var dist = timestamp - point.timestamp;
      if(dist > 0 && dist < minDist) {
        dist = minDist;
        res = point;
      }
    }
    return res;
  }
}

export class WeatherSeries {
  public windPoints: WindPointSet = new WindPointSet([]);
  public weatherPoints: WeatherPointSet = new WeatherPointSet([]);
}