import { ModuleConfig } from '../module-config';
import { WeatherSeries, WindPoint, WeatherPoint } from './weather-series';
import * as _ from 'lodash';


const DEFAULT_MAPPING = function(seriesListItem) {
  /*
  Should return:
  {
    windPoints: [[
        timestamp,
        'N'|'NNE'|'NE'|'ENE'|'E'|'ESE'|'SE'|'SSE'|'S'|'SSW'|'SW'|'WSW'|'W'|'WNW'|'NW'|'NNW',
        speed (meters per second)
    ]],
    weatherPoints: [[
        timestamp,
        [1..47] (id)
    ]]
  }
  */
  
  

  const WIND_DIRECTIONS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  const WIND_TIME_STEP = 100 * 60 * 1000; // 100 minutes
  
  const WEATHER_ID_COUNT = 47;

  var points = seriesListItem[0].datapoints;
  
  
  function isInside(timestamp) {
    if(timestamp < points[0][1]) {
      return false;
    }
    if(timestamp > points[points.length - 1][1]) {
      return false;
    }
    return true;
  }

  var res = {
    windPoints: new Array(),
    weatherPoints: new Array()
  };
  
  var windTimePoints = {};
  var weatherTimePoints = {}

  for (var i = 0; i < points.length; i++) {
    var timestamp = points[i][1];
    var value = points[i][0];
    
    var windTimestamp = Math.round(timestamp / WIND_TIME_STEP) * WIND_TIME_STEP; // day middle
    
    var weatherTimestamp = (new Date(timestamp)).setHours(12,0,0,0);

    if(windTimePoints[windTimestamp] === undefined) {
      windTimePoints[windTimestamp] = true;
      var dir = WIND_DIRECTIONS[Math.abs(Math.floor(value)) % WIND_DIRECTIONS.length];
      var speed = Math.abs(value);
      if(isInside(windTimestamp)) {
        res.windPoints.push([windTimestamp, dir, speed]);
      }
    }

    if(weatherTimePoints[weatherTimestamp] === undefined) {
      weatherTimePoints[weatherTimestamp] = true;
      var id = (Math.abs(Math.floor(value)) % WEATHER_ID_COUNT) + 1;
      if(isInside(weatherTimestamp)) {
        res.weatherPoints.push([weatherTimestamp, id]);  
      }
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
    weatherSeries.windPoints.points = _.map(
      rawData.windPoints, ([t, d, s]) => new WindPoint(t, d, s)
    );
    weatherSeries.weatherPoints.points = _.map(
      rawData.weatherPoints, ([t, d]) => new WeatherPoint(t, d)
    );
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