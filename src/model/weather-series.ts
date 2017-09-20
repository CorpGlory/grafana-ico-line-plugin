
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
  public constructor(time: number, direction: string) {
    if(time === undefined) {
      throw new Error('time is undefined');
    }
    if(direction === undefined) {
      throw new Error('direction is undefined');
    }
    this.timestamp = new Date(time);
    this.direction = WindDirection[direction];
  }
}

export type WindPointSet = WindPoint[];

export class WeatherSeries {
  public windPoints: WindPointSet = [];
}