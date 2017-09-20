
export const WIND_DIRECTIONS_COUNT = 16;

// order must be clockwise
// https://cdn.windfinder.com/prod/images/help/wind_directions.9d696e7e.png
export enum WindDirection {
  N, NNE, NE, ENE, E, ESE, SE, SSE,
  S, SSW, SW, WSW, W, WNW, NW, NNW
}

export class WindPoint {
  public timestamp: Date;
  public direction: WindDirection;
  public speed: number; // mph
  public constructor(time: number, direction: string, speed: number) {
    if(time === undefined) {
      throw new Error('time is undefined');
    }
    if(direction === undefined) {
      throw new Error('direction is undefined');
    }
    if(speed === undefined) {
      throw new Error('speed is undefined');
    }
    this.timestamp = new Date(time);
    this.direction = WindDirection[direction];
    this.speed = speed;
  }
}

export type WindPointSet = WindPoint[];

export class WeatherSeries {
  public windPoints: WindPointSet = [];
}