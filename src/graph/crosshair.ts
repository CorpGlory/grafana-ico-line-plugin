import { d3SSelection } from './types';
import { RenderConfig } from 'render-config';

export class Crosshair {

  private _renderConfig: RenderConfig;
  
  constructor(canvas: d3SSelection, renderConfig: RenderConfig) {
    this._renderConfig = renderConfig;
  }
  
  public show(timestamp: number) {
    
  }
  
  public hide() {
    
  }
}