import WorldMap from './worldmap';
import DataBuilder from '../test/data_builder';
import $ from 'jquery';

describe('Worldmap', () => {
  let worldMap;
  let ctrl;

  beforeEach(() => {
    setupWorldmapFixture();
  });

  describe('when a Worldmap is created', () => {
    it('should add Leaflet to the map div', () => {
      expect(document.getElementsByClassName('leaflet-container')[0]).not.toBe(null);
    });
  });

  describe('when the data has one point', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withDataRange(1, 1, 0)
        .build();
      ctrl.panel.circleMaxSize = '10';
      worldMap.drawCircles();
    });

    it('should draw one circle on the map', () => {
      expect(worldMap.circles.length).toBe(1);
      expect(worldMap.circles[0]._latlng.lat).toBe(60);
      expect(worldMap.circles[0]._latlng.lng).toBe(18);
    });

    it('should create a circle with max circle size', () => {
      expect(worldMap.circles[0].options.radius).toBe(10);
    });

    it('should create a circle popup with the data point value', () => {
      expect(worldMap.circles[0]._popup._content).toBe('Sweden: 1');
    });
  });

  describe('when the data has two points', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withCountryAndValue('IE', 2)
        .withDataRange(1, 2, 1)
        .build();
      ctrl.panel.circleMinSize = '2';
      ctrl.panel.circleMaxSize = '10';
      worldMap.drawCircles();
    });

    it('should draw two circles on the map', () => {
      expect(worldMap.circles.length).toBe(2);
    });

    it('should create a circle with min circle size for smallest value size', () => {
      expect(worldMap.circles[0].options.radius).toBe(2);
    });

    it('should create a circle with max circle size for largest value size', () => {
      expect(worldMap.circles[1].options.radius).toBe(10);
    });

    it('should create two circle popups with the data point values', () => {
      expect(worldMap.circles[0]._popup._content).toBe('Sweden: 1');
      expect(worldMap.circles[1]._popup._content).toBe('Ireland: 2');
    });
  });

  describe('when units option is set', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withCountryAndValue('IE', 2)
        .withDataRange(1, 2, 1)
        .build();
      ctrl.panel.circleMinSize = '2';
      ctrl.panel.circleMaxSize = '10';
      ctrl.panel.unitSingular = 'error';
      ctrl.panel.unitPlural = 'errors';
      worldMap.drawCircles();
    });

    it('should create a circle popup using the singular unit in the label', () => {
      expect(worldMap.circles[0]._popup._content).toBe('Sweden: 1 error');
    });

    it('should create a circle popup using the plural unit in the label', () => {
      expect(worldMap.circles[1]._popup._content).toBe('Ireland: 2 errors');
    });
  });

  describe('when the data has three points', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withCountryAndValue('IE', 2)
        .withCountryAndValue('US', 3)
        .withDataRange(1, 3, 2)
        .withThresholdValues([2])
        .build();
      ctrl.panel.circleMinSize = '2';
      ctrl.panel.circleMaxSize = '10';
      worldMap.drawCircles();
    });

    it('should draw three circles on the map', () => {
      expect(worldMap.circles.length).toBe(3);
    });

    it('should create a circle with min circle size for smallest value size', () => {
      expect(worldMap.circles[0].options.radius).toBe(2);
    });

    it('should create a circle with circle size 6 for mid value size', () => {
      expect(worldMap.circles[1].options.radius).toBe(6);
    });

    it('should create a circle with max circle size for largest value size', () => {
      expect(worldMap.circles[2].options.radius).toBe(10);
    });

    it('should set red color on values under threshold', () => {
      expect(worldMap.circles[0].options.color).toBe('red');
    });

    it('should set blue color on values equal to or over threshold', () => {
      expect(worldMap.circles[1].options.color).toBe('blue');
      expect(worldMap.circles[2].options.color).toBe('blue');
    });

    it('should create three circle popups with the data point values', () => {
      expect(worldMap.circles[0]._popup._content).toBe('Sweden: 1');
      expect(worldMap.circles[1]._popup._content).toBe('Ireland: 2');
      expect(worldMap.circles[2]._popup._content).toBe('United States: 3');
    });
  });

  describe('when the data has empty values and hideEmpty is true', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withCountryAndValue('IE', 2)
        .withCountryAndValue('US', null)
        .withDataRange(1, 3, 2)
        .withThresholdValues([2])
        .build();
      ctrl.panel.hideEmpty = true;
      worldMap.drawCircles();
    });

    it('should draw three circles on the map', () => {
      expect(worldMap.circles.length).toBe(2);
    });
  });

  describe('when the data has empty values and hideEmpty is true', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withCountryAndValue('IE', 2)
        .withCountryAndValue('US', 0)
        .withDataRange(1, 3, 2)
        .withThresholdValues([2])
        .build();
      ctrl.panel.hideZero = true;
      worldMap.drawCircles();
    });

    it('should draw three circles on the map', () => {
      expect(worldMap.circles.length).toBe(2);
    });
  });

  describe('when the data is updated but not locations', () => {
    beforeEach(() => {
      ctrl.panel.circleMinSize = '2';
      ctrl.panel.circleMaxSize = '10';

      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withCountryAndValue('IE', 2)
        .withCountryAndValue('US', 3)
        .withDataRange(1, 3, 2)
        .withThresholdValues([2])
        .build();

      worldMap.drawCircles();

      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 3)
        .withCountryAndValue('IE', 2)
        .withCountryAndValue('US', 1)
        .withDataRange(1, 3, 2)
        .withThresholdValues([2])
        .build();

      worldMap.drawCircles();
    });

    it('should create three circle popups with updated data', () => {
      expect(worldMap.circles[0]._popup._content).toBe('Sweden: 3');
      expect(worldMap.circles[1]._popup._content).toBe('Ireland: 2');
      expect(worldMap.circles[2]._popup._content).toBe('United States: 1');
    });

    it('should set red color on values under threshold', () => {
      expect(worldMap.circles[2].options.color).toBe('red');
    });

    it('should set blue color on values equal to or over threshold', () => {
      expect(worldMap.circles[0].options.color).toBe('blue');
      expect(worldMap.circles[1].options.color).toBe('blue');
    });
  });

  describe('when the number of locations changes', () => {
    beforeEach(() => {
      ctrl.panel.circleMinSize = '2';
      ctrl.panel.circleMaxSize = '10';

      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 1)
        .withCountryAndValue('IE', 2)
        .withCountryAndValue('US', 3)
        .withDataRange(1, 3, 2)
        .withThresholdValues([2])
        .build();

      worldMap.drawCircles();

      ctrl.data = new DataBuilder()
        .withCountryAndValue('SE', 2)
        .withDataRange(1, 1, 0)
        .withThresholdValues([2])
        .build();

      worldMap.drawCircles();
    });

    it('should create one circle popups with updated data', () => {
      expect(worldMap.circles[0]._popup._content).toBe('Sweden: 2');
    });

    it('should set blue color on values equal to or over threshold', () => {
      expect(worldMap.circles[0].options.color).toBe('blue');
    });
  });

  describe('when one threshold is set', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder().withThresholdValues([2]).build();
      worldMap.createLegend();
    });

    it('should create a legend with two legend values', () => {
      expect(worldMap.legend).toBeDefined();
      expect(worldMap.legend._div.outerHTML).toBe(
        '<div class="info legend leaflet-control">' +
          '<div class="legend-item">' +
          '<i style="background:red"></i> &lt; 2</div><div class="legend-item"><i style="background:blue"></i> 2+</div>' +
          '</div>'
      );
    });
  });

  describe('when legend removed', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder().withThresholdValues([2]).build();
      worldMap.createLegend();
      worldMap.removeLegend();
    });

    it('should remove the legend from the worldmap', () => {
      expect(worldMap.legend).toBe(null);
    });
  });

  describe('when two thresholds are set', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder().withThresholdValues([2, 4]).build();
      worldMap.createLegend();
    });

    it('should create a legend with three legend values', () => {
      expect(worldMap.legend).toBeDefined();
      expect(worldMap.legend._div.outerHTML).toBe(
        '<div class="info legend leaflet-control"><div class="legend-item">' +
          '<i style="background:red"></i> &lt; 2</div><div class="legend-item"><i style="background:blue"></i> 2–4</div>' +
          '<div class="legend-item"><i style="background:green"></i> 4+</div></div>'
      );
    });
  });

  describe('when three thresholds are set', () => {
    beforeEach(() => {
      ctrl.data = new DataBuilder().withThresholdValues([2, 4, 6]).build();
      worldMap.createLegend();
    });

    it('should create a legend with four legend values', () => {
      expect(worldMap.legend).toBeDefined();
      expect(worldMap.legend._div.outerHTML).toBe(
        '<div class="info legend leaflet-control"><div class="legend-item">' +
          '<i style="background:red"></i> &lt; 2</div><div class="legend-item"><i style="background:blue"></i> 2–4</div>' +
          '<div class="legend-item"><i style="background:green"></i> 4–6</div>' +
          '<div class="legend-item"><i style="background:undefined"></i> 6+</div></div>'
      );
    });
  });

  describe('when the legend should be displayed out-of-band', () => {
    /*
     * Optimizations for small maps
     *
     * In order to test the `createMap()` method,
     * we need to pass a half-configured `WorldMap`
     * instance into the test cases.
     *
     * We are testing the "legendContainerSelector" and "showAttribution"
     * options here to proof they actually toggle the visibility
     * of the respective control elements.
     *
     * See also https://community.hiveeyes.org/t/grafana-worldmap-panel-ng/1824/3
     */
    beforeEach(() => {
      ctrl.data = new DataBuilder().withThresholdValues([2, 4, 6]).build();
      ctrl.panel.legendContainerSelector = '.shared-map-legend';
      document.body.insertAdjacentHTML('afterbegin', '<div class="shared-map-legend"></div>');
      worldMap.createLegend();
    });

    it('we should find the respective element at the appropriate place in the DOM', () => {
      expect(worldMap.legend).toBeDefined();
      expect($('.shared-map-legend')[0].innerHTML).toBe(
        '<div class="info legend leaflet-control"><div class="legend-item">' +
          '<i style="background:red"></i> &lt; 2</div><div class="legend-item"><i style="background:blue"></i> 2–4</div>' +
          '<div class="legend-item"><i style="background:green"></i> 4–6</div>' +
          '<div class="legend-item"><i style="background:undefined"></i> 6+</div></div>'
      );
    });
  });

  afterEach(() => {
    const fixture: HTMLElement = document.getElementById('fixture')!;
    document.body.removeChild(fixture);
  });

  function setupWorldmapFixture() {
    const fixture = '<div id="fixture" class="mapcontainer"></div>';
    document.body.insertAdjacentHTML('afterbegin', fixture);

    ctrl = {
      panel: {
        center: {
          mapCenterLatitude: 0,
          mapCenterLongitude: 0,
          initialZoom: 1,
        },
        colors: ['red', 'blue', 'green'],
        circleOptions: {},
      },
      tileServer: 'CartoDB Positron',
    };

    // This mimics the `ctrl.panel` proxying established
    // by `PluginSettings` to make the tests happy.
    // Todo: Don't worry, this will go away.
    ctrl.settings = ctrl.panel;

    worldMap = new WorldMap(ctrl, document.getElementsByClassName('mapcontainer')[0]);
    worldMap.createMap();
  }
});

describe('WorldmapFoundation', () => {
  /*
   * Optimizations for small maps
   *
   * In order to test the `createMap()` method,
   * we need to pass a half-configured `WorldMap`
   * instance into the test cases.
   *
   * We are testing the "showZoomControl" and "showAttribution"
   * options here to proof they actually toggle the visibility
   * of the respective control elements.
   *
   * See also https://community.hiveeyes.org/t/grafana-worldmap-panel-ng/1824/3
   */

  let worldMap;
  let ctrl;

  beforeEach(() => {
    setupWorldmapHalfFixture();
  });

  describe('when a Worldmap is created with default parameters', () => {
    beforeEach(() => {
      worldMap.createMap();
    });

    it('all control elements should be present', () => {
      expect(document.getElementsByClassName('leaflet-container')[0]).toBeDefined();
      expect(document.getElementsByClassName('leaflet-control-zoom')[0]).toBeDefined();
      expect(document.getElementsByClassName('leaflet-control-attribution')[0]).toBeDefined();
    });
  });

  describe('when a Worldmap is created with showZoomControl disabled', () => {
    beforeEach(() => {
      ctrl.panel.showZoomControl = false;
      worldMap.createMap();
    });

    it('the element should not be present in DOM', () => {
      expect(document.getElementsByClassName('leaflet-control-zoom')[0]).toBeUndefined();
    });
  });

  describe('when a Worldmap is created with showAttribution disabled', () => {
    beforeEach(() => {
      ctrl.panel.showAttribution = false;
      worldMap.createMap();
    });

    it('the element should not be present in DOM', () => {
      expect(document.getElementsByClassName('leaflet-control-attribution')[0]).toBeUndefined();
    });
  });

  afterEach(() => {
    const fixture: HTMLElement = document.getElementById('fixture')!;
    document.body.removeChild(fixture);
  });

  function setupWorldmapHalfFixture() {
    const fixture = '<div id="fixture" class="mapcontainer"></div>';
    document.body.insertAdjacentHTML('afterbegin', fixture);

    ctrl = {
      panel: {
        center: {
          mapCenterLatitude: 0,
          mapCenterLongitude: 0,
          initialZoom: 1,
        },
        colors: ['red', 'blue', 'green'],
        circleOptions: {},
        showZoomControl: true,
        showAttribution: true,
      },
      tileServer: 'CartoDB Positron',
    };

    // This mimics the `ctrl.panel` proxying established
    // by `PluginSettings` to make the tests happy.
    // Todo: Don't worry, this will go away.
    ctrl.settings = ctrl.panel;

    worldMap = new WorldMap(ctrl, document.getElementsByClassName('mapcontainer')[0]);
  }
});
