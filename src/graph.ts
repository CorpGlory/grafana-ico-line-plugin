import * as d3 from 'd3';
import * as $ from 'jquery';


type d3Selection = d3.Selection<HTMLElement, {}, null, undefined>;


const MARGIN = { top: 20, right: 20, bottom: 50, left: 70 };


export class Graph {
  
  private _width: number = 0;
  private _height: number = 0;
  
  // TODO: use typef ? 
  private _svg: d3Selection;
  private _$holder: JQLite;

  constructor(element: any) {
    this._$holder = $(element).find('.graphHolder');
    this._svg = d3
      .select(this._$holder.get(0))
      .append("svg");
    this._svg
      .attr("width", 50)
      .attr("height", 50)
      .append("circle")
      .attr("cx", 25)
      .attr("cy", 25)
      .attr("r", 25)
      .style("fill", "purple");
  }

  updateData(values: object[]) {
    if(values.length === 0) {
      this._showNoData();
      return;
    }
  }

  private _showNoData() {
  }

}