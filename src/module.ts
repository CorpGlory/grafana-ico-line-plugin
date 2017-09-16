/// <reference path="./module-config.ts" />
/// <reference path="./graph.ts" />

import { ModuleConfig } from './module-config';
import { Graph } from './graph';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';


class Ctrl extends MetricsPanelCtrl {

  static templateUrl = "partials/template.html";
  
  private _graph: Graph;

  constructor($scope, $injector) {
    super($scope, $injector);
    ModuleConfig.init(this.panel);
    this._initStyles();
    
    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
  }

  link(scope, element) {
    this._graph = new Graph(element);
  }
  
  _initStyles() {
    loadPluginCss({
      light: this.panelPath + 'css/panel.light.css',
      dark: this.panelPath + 'css/panel.dark.css'
    });
  }

  _onDataReceived(seriesList: any) {
    if(!this._graph) {
      return;
    }
    this._graph.updateData([]);
  }

  _onInitEditMode() {
    var thisPartialPath = this.panelPath + 'partials/';
    this.addEditorTab(
      'Editor', thisPartialPath + 'editor.html', 2
    );
  }

  _dataError(err) {
    this.$scope.data = [];
    this.$scope.dataError = err;
  }
  
  private _panelPath?: string;
  protected get panelPath() {
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
