import * as d3 from 'd3';


export class RenderConfig {
  public x: d3.ScaleTime<number, number> = d3.scaleTime();
  public y: d3.ScaleLinear<number, number> = d3.scaleLinear();
  
  public get width() {
    return this.x.range()[1];
  }
  
  public set width(value: number) {
    this.x.range([0, value]);
  }
  
  public get height() {
    return this.y.range()[0];
  }
  
  public set height(value: number) {
    this.y.range([value, 0]);
  }
  
}