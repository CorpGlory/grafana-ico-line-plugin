import { ModuleConfig } from './module-config';
import { Graph } from './graph/graph';
import { RenderConfig } from './render-config';
import { SeriesMapper } from './model/series-mapper';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';


class Ctrl extends MetricsPanelCtrl {

  static templateUrl = "partials/template.html";

  private _graph: Graph;
  private _panelContent: HTMLElement;
  private _renderConfig: RenderConfig;
  
  private _seriesMapper: SeriesMapper;

  constructor($scope, $injector) {
    super($scope, $injector);
    ModuleConfig.init(this.panel);
    this._initStyles();
    this._renderConfig = new RenderConfig();

    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('render', this._onRender.bind(this));

    this.$scope.showNoData = false;
    this._seriesMapper = $scope.seriesMapper = new SeriesMapper();
  }

  link(scope, element) {
    this._panelContent = element.find('.panel-content')[0] as HTMLElement;
    this._graph = new Graph(
      element.find('.graphHolder')[0] as HTMLElement,
      this._renderConfig
    );
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
    if(seriesList === undefined || seriesList.length === 0) {
      this.$scope.showNoData = true;
    } else {
      this.$scope.showNoData = false;
    }
    this._renderConfig.timeRange = this.range;
    var weatherSeries = this._seriesMapper.map(seriesList);
    this._graph.setData(weatherSeries);
    this._onRender();
  }

  private _onInitEditMode() {
    var thisPartialPath = this.panelPath + 'partials/';
    this.addEditorTab(
      'Editor', thisPartialPath + 'editor.mapping.html', 2
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
