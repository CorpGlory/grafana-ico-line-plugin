import { ModuleConfig } from 'module-config';
import { WeatherSeries } from './weather-series';


const DEFAULT_MAPPING = function(seriesListItem) {
  /*
  Should return:
  {
    windDirections: [[
      timestamp,
      'N'|'NNE'|'NE'|'ENE'|'E'|'ESE'|'SE'|'SSE'|'S'|'SSW'|'SW'|'WSW'|'W'|'WNW'|'NW'|'NNW'
    ]]
  }
  */

  var res = [];
  var points = seriesListItem.datapoints;

  for (let i = 0; i < points.length; i++) {
    var timestamp = points[i][1];
    var value = points[i][0];
    res.push();
  }

  // return res;

  return {
    windDirections: [
      [1, 'NNE'], [2, 'ENE'], [3, 'NNW'], [4, 'WNW'], [5, 'NW']
    ]
  };

}

export function getDefaultOptions() {
  return {
    mappingFunctionSource: (DEFAULT_MAPPING + "$")
      .replace('function DEFAULT_MAPPING(', 'function(')
      .replace(new RegExp('        ', 'g'), '  ')
      .replace('      }$', '}')
  }
}


export class SeriesMapper {
  
  private _mappingFunction: any;
  private _moduleConfig: ModuleConfig;
  
  constructor(moduleConfig) {
    this._moduleConfig = moduleConfig;
    _.defaults(this._moduleConfig, getDefaultOptions());
    this.update();
  }
  
  public get mappingFunctionSource(): string {
    return 
  }
  

  public mapSeriesToItems(seriesListItem) : WeatherSeries {
    if(seriesListItem === undefined) {
      throw new Error('Trying to pass undefined seriesListItem');
    }
    var rawData: any = this._mappingFunction(seriesListItem);
    var weatherSeries: WeatherSeries = new WeatherSeries();
    
    return weatherSeries;
  }
  
  private _update() {
    var src = '(' + this._moduleConfig.mappingFunctionSource +')';
    /* jshint ignore:start */
    try {
      this._mappingFunction = eval(src);
    } catch(e) {
      throw new Error('Mapping function execution error: ' + e);
    }
    /* jshint ignore:end */
  }
}