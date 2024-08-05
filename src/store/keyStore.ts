import { observable } from "@legendapp/state";

const queryParams = new URLSearchParams(window.location.search);

const mapboxKey = import.meta.env.VITE_MAPBOX_KEY || queryParams.get('mapboxKey') || '';
const pullKey = import.meta.env.VITE_PULL_KEY || queryParams.get('pullKey') || '';
const stadiaProviderKey = import.meta.env.VITE_STADIA_PROVIDER_KEY || queryParams.get('stadiaProviderKey') || '';
const streamElementsKey = import.meta.env.VITE_STREAMELEMENTS_KEY || queryParams.get('streamElementsKey') || '';
const timezoneKey = import.meta.env.VITE_TIMEZONE_KEY || queryParams.get('timezoneKey') || '';
const weatherKey = import.meta.env.VITE_OPENWEATHER_KEY || queryParams.get('weatherKey') || '';
const twitchUserName = import.meta.env.VITE_TWITCH_USER_NAME || queryParams.get('twitch-user-name') || '';
const twitchUserToken = import.meta.env.VITE_TWITCH_USER_TOKEN || queryParams.get('twitch-user-token') || '';
const twitchAppId = import.meta.env.VITE_TWITCH_APP_ID || queryParams.get('twitch-app-id') || '';
const twitchAppToken = import.meta.env.VITE_TWITCH_APP_TOKEN || queryParams.get('twitch-app-token') || '';

const keyStore = observable({
  mapboxKey: mapboxKey,
  pullKey: pullKey,
  stadiaProviderKey: stadiaProviderKey,
  streamElementsKey: streamElementsKey,
  streamElementsChannel: '',
  timezoneKey: timezoneKey,
  weatherKey: weatherKey,
  twitchUserName: twitchUserName,
  twitchUserToken: twitchUserToken,
  twitchAppId: twitchAppId,
  twitchAppToken: twitchAppToken
});

export default keyStore;