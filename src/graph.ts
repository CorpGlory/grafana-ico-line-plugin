import * as d3 from 'd3';

export class Graph {

  constructor(element: any) {
    console.log(d3.select);
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