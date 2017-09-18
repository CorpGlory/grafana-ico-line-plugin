/// <reference path="./module-config.ts" />
/// <reference path="./graph/graph.ts" />

import { ModuleConfig } from './module-config';
import { Graph } from './graph/graph';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';


class Ctrl extends MetricsPanelCtrl {

  static templateUrl = "partials/template.html";
  
  private _graph: Graph;
  private _panelContent: HTMLElement;

  constructor($scope, $injector) {
    super($scope, $injector);
    ModuleConfig.init(this.panel);
    this._initStyles();
    
    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('render', this._onRender.bind(this));
  }
  
  link(scope, element) {
    this._panelContent = element.find('.panel-content')[0] as HTMLElement;
    this._graph = new Graph(element.find('.graphHolder')[0] as HTMLElement);
  }
  
  private _initStyles() {
    // small hack to load base styles
    loadPluginCss({
      light: this.panelPath + 'css/panel.base.css',
      dark: this.panelPath + 'css/panel.base.css'
    });
    loadPluginCss({
      light: this.panelPath + 'css/panel.light.css',
      dark: this.panelPath + 'css/panel.dark.css'
    });
  }
  
  private _onRender() {
    this._panelContent.style.height = this.height + 'px';
    this._graph.render();
  }

  private _onDataReceived(seriesList: any) {
    if(!this._graph) {
      return;
    }
    this._graph.updateData(seriesList);
    this._onRender();
  }

  private _onInitEditMode() {
    var thisPartialPath = this.panelPath + 'partials/';
    this.addEditorTab(
      'Editor', thisPartialPath + 'editor.html', 2
    );
  }
  
  private _panelPath?: string;
  private get panelPath() {
    if(!this._panelPath) {
      var panels = window['grafanaBootData'].settings.panels;
      var thisPanel = panels[this.pluginId];
      // the system loader preprends publib to the url,
      // add a .. to go back one level
      this._panelPath = '../' + thisPanel.baseUrl + '/';
    }
    return this._panelPath;
  }
}


export { Ctrl as PanelCtrl }
