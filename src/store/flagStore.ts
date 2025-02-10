import { observable } from "@legendapp/state";

const queryParams = new URLSearchParams(window.location.search);

const getQueryParamFlag = (key) => {
  return queryParams.has(key.toLowerCase()) || queryParams.has(key.toUpperCase()) || queryParams.has(key);
};

const parseZoomLevels = (zoomLevelsString) => {
  return zoomLevelsString.split(',').filter(pair => pair.includes('-'));
};

const flagStore = observable({
  disableAnimation: getQueryParamFlag('disableAnimation'),
  hideMap: getQueryParamFlag('hideMap'),
  hideTime: getQueryParamFlag('hideTime'),
  mapFollowsHeading: getQueryParamFlag('mapFollowsHeading'),
  mapHasBorder: getQueryParamFlag('mapHasBorder'),
  mapIs3d: getQueryParamFlag('mapIs3d'),
  mapIsCircular: getQueryParamFlag('mapIsCircular'),
  mapZoom: queryParams.get('mapZoom') || '15',
  pulseMarker: getQueryParamFlag('pulseMarker'),
  shortLocation: getQueryParamFlag('shortLocation'),
  showAltitude: getQueryParamFlag('showAltitude'),
  showDistance: getQueryParamFlag('showDistance'),
  showHeading: getQueryParamFlag('showHeading'),
  showHeartrate: getQueryParamFlag('showHeartrate'),
  showRpm: getQueryParamFlag('showRpm'),
  showMetrics: getQueryParamFlag('showMetrics'),
  showSpeed: getQueryParamFlag('showSpeed'),
  showPrices: getQueryParamFlag('showPrices'),
  splitDateTime: getQueryParamFlag('splitDateTime'),
  streamElementsSubscribed: false,
  theme: queryParams.get('theme') || 'mapbox-japan',
  timeAtBottom: getQueryParamFlag('timeAtBottom'),
  useImperial: getQueryParamFlag('useImperial'),
  currency: queryParams.get('currency') || 'dollar',
  zoomLevels: queryParams.get('zoomLevels') || '',
  zoomLevelPairs: parseZoomLevels(queryParams.get('zoomLevels') || ''),
});

export default flagStore;
