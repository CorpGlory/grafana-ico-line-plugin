
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

export type WindPointSet = WindPoint[];

export class WavePoint {
  public timestamp: number;
  public height: number;
  public constructor(timestamp: number, height: number) {
    if(timestamp === undefined) {
      throw new Error('timestamp is undefined');
    }
    if(height === undefined) {
      throw new Error('height is undefined');
    }
    this.timestamp = timestamp;
  }
}

export type WavePointSet = WavePoint[];

export class WeatherSeries {
  public windPoints: WindPointSet = [];
  public wavePoints: WavePointSet = [];
}