import { ModuleConfig } from './module-config';
import { Graph } from './graph/graph';
import { RenderConfig } from './render-config';
import { SeriesMapper } from './model/series-mapper';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';

import * as _ from 'lodash';


class Ctrl extends MetricsPanelCtrl {

  static templateUrl = "partials/template.html";

  private _graph: Graph;
  private _panelContent: HTMLElement;
  private _renderConfig: RenderConfig;

  private _seriesMapper: SeriesMapper;
  private _seriesList: any;

  constructor($scope, $injector) {
    super($scope, $injector);

    ModuleConfig.init(this.panel);
    this._initStyles();
    this._renderConfig = new RenderConfig();

    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('render', this._onRender.bind(this));

    this.$scope.showNoData = false;
    this._seriesMapper = new SeriesMapper();
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
      light: ModuleConfig.getInstance().pluginDirName + 'css/panel.base.css',
      dark: ModuleConfig.getInstance().pluginDirName + 'css/panel.base.css'
    });
    loadPluginCss({
      light: ModuleConfig.getInstance().pluginDirName + 'css/panel.light.css',
      dark: ModuleConfig.getInstance().pluginDirName + 'css/panel.dark.css'
    });
  }

  private _onRender() {
    this._panelContent.style.height = this.height + 'px';
    console.log('h: ' + this._panelContent.style.height);
    this._graph.render();
  }

  private _updateGraphData() {
    var weatherSeries = this._seriesMapper.map(this._seriesList);
    this._renderConfig.speedLimit = _.max(weatherSeries.windPoints.map(s => s.speed));
    this._renderConfig.wavesLimit = _.max(weatherSeries.windPoints.map(s => s.speed));
    this._graph.setData(weatherSeries);
  }

  private _onDataReceived(seriesList: any) {
    if(seriesList === undefined || seriesList.length === 0) {
      this.$scope.showNoData = true;
    } else {
      this.$scope.showNoData = false;
    }
    this._seriesList = seriesList;
    this._renderConfig.timeRange = this.range;
    this._updateGraphData();
    this._onRender();
  }

  private _onInitEditMode() {
    var thisPartialPath = ModuleConfig.getInstance().pluginDirName + 'partials/';
    this.addEditorTab(
      'Editor', thisPartialPath + 'editor.mapping.html', 2
    );
  }

}


export { Ctrl as PanelCtrl }
