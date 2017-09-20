import { ModuleConfig } from '../module-config';
import { WeatherSeries, WindPoint } from './weather-series';
import * as _ from 'lodash';


const DEFAULT_MAPPING = function(seriesListItem) {
  /*
  Should return:
  {
    windPoints: [[
        timestamp,
        'N'|'NNE'|'NE'|'ENE'|'E'|'ESE'|'SE'|'SSE'|'S'|'SSW'|'SW'|'WSW'|'W'|'WNW'|'NW'|'NNW',
        speed (meters per second)
    ]]l
  }
  */

  const WIND_DIRECTIONS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  const WIND_TIME_STEP = 100 * 60 * 1000; // 45 minutes

  var points = seriesListItem[0].datapoints;

  var res = {
    windPoints: new Array()
  }

  var weatherLastTimestamp = 0;

  for (var i = 0; i < points.length; i++) {
    var timestamp = points[i][1];
    var value = points[i][0];

    if(timestamp - weatherLastTimestamp >= WIND_TIME_STEP) {
      weatherLastTimestamp = timestamp;
      var dir = WIND_DIRECTIONS[Math.abs(Math.floor(value)) % WIND_DIRECTIONS.length];
      var speed = Math.abs(value);
      res.windPoints.push([timestamp, dir, speed]);
    }

  }

  return res;

}

export function getDefaultSource() {
  return (DEFAULT_MAPPING + "$")
      .replace('function DEFAULT_MAPPING(', 'function(')
      .replace(new RegExp('    ', 'g'), '  ')
      .replace('}$', '}');
}

export class SeriesMapper {

  private _mappingFunction: any;

  constructor() {
    this._update();
  }

  public get mappingFunctionSource(): string {
    var cres = ModuleConfig.getInstance().getValue('mappingFunctionSource');
    var res = cres !== undefined ? cres : getDefaultSource();
    return res;
  }

  public set mappingFunctionSource(value: string) {
    ModuleConfig.getInstance().setValue('mappingFunctionSource', value);
    this._update();
  }

  public map(seriesListItem): WeatherSeries {
    if(seriesListItem === undefined) {
      throw new Error('Trying to pass undefined seriesListItem');
    }
    var rawData: any = this._mappingFunction(seriesListItem);
    var weatherSeries: WeatherSeries = new WeatherSeries();
    weatherSeries.windPoints = _.map(rawData.windPoints, ([t, d, s]) => new WindPoint(t, d, s));

    return weatherSeries;
  }

  private _update() {
    var src = '(' + this.mappingFunctionSource +')';
    /* jshint ignore:start */
    try {
      this._mappingFunction = eval(src);
    } catch(e) {
      throw new Error('Mapping function execution error: ' + e);
    }
    /* jshint ignore:end */
  }
}