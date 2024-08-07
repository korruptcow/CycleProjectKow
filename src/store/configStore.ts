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
    },
    targets: {
        goalDistance: 'goalDistance',
        totalDistance: 'totalDistance',
        tip: 'tip',
        sub: 'sub',
    }
});



export default configStore;
