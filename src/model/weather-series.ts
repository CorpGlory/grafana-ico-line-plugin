// https://cdn.windfinder.com/prod/images/help/wind_directions.9d696e7e.png
export enum WindDirection {
  N, NNE, NE, ENE, E, ESE, SE, SSE, 
  S, SSW, SW, WSW, W, WNW, NW, NNW
}

export class WindPoint {
  public timestamp: Date;
  public direction: WindDirection;
  public constructor(time: number, direction: string) {
    this.timestamp = new Date(time);
    this.direction = WindDirection[direction];
  }
}

export class WeatherSeries {
  public windPoints: WindPoint[] = [];
}