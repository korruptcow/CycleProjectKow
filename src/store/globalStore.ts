import {observable} from "@legendapp/state";
import {defaultWeatherValues} from "@components/Weather/defaultWeatherValues";
import {loadFloatFromLocalStorage, loadListFromLocalStorage, saveToLocalStorage} from "@store/persistence.ts";

const globalStore = observable({
    altitude: {
        EGM96: 0,
        WGS84: 0
    },
    date: '',
    dateTime: '',
    distance: 0,
    geocode: {},
    heading: 0,
    heartrate: 0,
    revolutions: 0,
    rpm: 0,
    prevRpmUpdateTime: 0,
    location: {latitude: 0, longitude: 0},
    locationData: {...defaultWeatherValues},
    neighbourhood: '',
    prevLocation: {
        latitude: 0,
        longitude: 0,
    },
    updatedAt: 0,
    sessionId: '',
    speed: 0,
    streamElements: {
        'cheer-latest': {name: '', amount: 0},
        'follower-latest': {name: ''},
        'subscriber-latest': {name: '', amount: 0, tier: '1000'},
        'tip-latest': {name: '', amount: 0},
        'cheer-recent': [{name: '', amount: 0}],
        'follower-recent': [{name: ''}],
        'subscriber-recent': [{name: '', amount: 0, tier: '1000'}],
        'tip-recent': [{name: '', amount: 0}],
    },
    theme: 'mapbox://styles/mapbox/streets-v12',
    time: '',
    hideMap: false,
    hideChatUpdate: true,
    sessionDistance: loadFloatFromLocalStorage('sessionDistance'),
    totalDistance: loadFloatFromLocalStorage('totalDistance'),
    goalDistance: loadFloatFromLocalStorage('goalDistance'),
    modsWhitelist: observable(loadListFromLocalStorage('modsWhitelist')),
    subRatio: loadFloatFromLocalStorage('subRatio'),
    donationRatio: loadFloatFromLocalStorage('donationRatio'),
    trackingPaused: false,
    isFirstTrackingRecord: false,
    lastLocationUpdate: 0,
    currency: '€',
    zoneId: 'Europe/Paris',
});


// Observe changes and update local storage
globalStore.totalDistance.onChange(() => {
    saveToLocalStorage('totalDistance', globalStore.totalDistance.get());
});

globalStore.goalDistance.onChange(() => {
    saveToLocalStorage('goalDistance', globalStore.goalDistance.get());
});

globalStore.sessionDistance.onChange(() => {
    saveToLocalStorage('sessionDistance', globalStore.sessionDistance.get());
});

globalStore.modsWhitelist.onChange(() => {
    saveToLocalStorage('modsWhitelist', globalStore.modsWhitelist.peek());
});

globalStore.subRatio.onChange(() => {
    saveToLocalStorage('subRatio', globalStore.subRatio.get());
});

globalStore.donationRatio.onChange(() => {
    saveToLocalStorage('donationRatio', globalStore.donationRatio.get());
});


export default globalStore;
