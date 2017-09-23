import { ModuleConfig } from './module-config';
import { Graph } from './graph/graph';
import { RenderConfig } from './render-config';
import { SeriesMapper } from './model/series-mapper';
import { Tooltip } from './tooltip';
import { WeatherSeries, WindPoint } from './model/weather-series';

import { MetricsPanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';
import appEvents from 'grafana/app/core/app_events';

import * as _ from 'lodash';


class Ctrl extends MetricsPanelCtrl {

  static templateUrl = "partials/template.html";

  private _graph: Graph;
  private _panelContent: HTMLElement;
  private _renderConfig: RenderConfig;

  private _seriesMapper: SeriesMapper;
  private _seriesList: any;
  private _tooltip: Tooltip;
  private _weatherSeries: WeatherSeries;

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

    this._tooltip = new Tooltip(this.dashboard, this._renderConfig);
  }

  link(scope, element) {
    this._panelContent = element.find('.panel-content')[0] as HTMLElement;
    //this._panelContent.style.height = this.height + 'px';
    this._graph = new Graph(
      element.find('.graphHolder')[0] as HTMLElement,
      this._renderConfig
    );
    this._initCrosshairEvents();
  }

  private _initCrosshairEvents() {
    appEvents.on('graph-hover', event => {
      var isThis = event.panel.id === this.panel.id;
      if(!isThis) {
        if(!this.dashboard.sharedTooltipModeEnabled()) {
          return;
        }
        if(this.otherPanelInFullscreenMode()) {
          return;
        }
      }
      this._graph.showCrosshair(event.pos.x);
      var wpoint = this._weatherSeries.windPoints.findPoint(event.pos.x);
      if(wpoint === undefined) {
        return;
      }
      this._tooltip.show(event.pos.x, event.pos.panelRelY, wpoint as WindPoint);
    }, this.$scope);

    appEvents.on('graph-hover-clear', (event, info) => {
      this._graph.hideCrosshair();
      this._tooltip.hide();
    }, this.$scope);

    this._graph.mouseMoveHandler = (timestamp, panelRelY) => {
      appEvents.emit('graph-hover', {
        pos: { x: timestamp, panelRelY: panelRelY },
        panel: this.panel
      });
    };

    this._graph.mouseOutHandler = () => {
      appEvents.emit('graph-hover-clear');
    };
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
    this._graph.render();
    this._tooltip.render();
  }

  private _updateGraphData() {
    this._weatherSeries = this._seriesMapper.map(this._seriesList);
    this._renderConfig.speedLimit = this._weatherSeries.windPoints.getMaxSpeedLimit();
    this._graph.setData(this._weatherSeries);
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
    this.render();
  }

  private _onInitEditMode() {
    var thisPartialPath = ModuleConfig.getInstance().pluginDirName + 'partials/';
    this.addEditorTab(
      'Editor', thisPartialPath + 'editor.mapping.html', 2
    );
  }

}


export { Ctrl as PanelCtrl }
