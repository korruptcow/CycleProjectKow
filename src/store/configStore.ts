import {observable} from "@legendapp/state";

const configStore = observable({
    commands: {
        addModerator: 'cycleMod',
        removeModerator: 'cycleUnmod',
        addAmountKm: 'cycleAdd',
        minusAmountKm: 'cycleMinus',
        updateRate: 'cycleUpdateRatio',
        pauseTracking: 'cyclePause',
        unpauseTracking: 'cycleUnpause',
        resetCurrentSession: 'cycleRestartSession',
        hideMap: 'cycleHideMap',
        showMap: 'cycleShowMap',
    },
    targets: {
        goalDistance: 'goalDistance',
        totalDistance: 'totalDistance',
        sessionDistance: 'sessionDistance',
        tip: 'tip',
        sub: 'sub',
    }
});



export default configStore;
