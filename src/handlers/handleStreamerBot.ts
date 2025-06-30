import globalStore from '@store/globalStore.ts';
import valueFormatter from "@functions/valueFormatter.ts";
import flagStore from "@store/flagStore.ts";


// Reference to the sendSbVariable function from App.tsx
let sendSbVariableFunction: (goal: number, session: number, total: number, headingDir: string, headingNum: string, speed: number, altitude: string) => void;
let sendSbTempFunction: (temp: string) => void;

// Function to set the reference to the sendSbVariable function
export const setSendSbVariableFunction = (fn: (goal: number, session: number, total: number, headingDir: string, headingNum: string, speed: number, altitude: string) => void) => {
  sendSbVariableFunction = fn;
};
export const setSendSbTempFunction = (fn: (temp: string) => void) => {
  sendSbTempFunction = fn;
};

// Main handler function
const handleSbWebSocket = () => {
  // Set up listeners for changes to distance values
  globalStore.goalDistance.onChange(() => {
    const { totalDistance, sessionDistance, goalDistance, heading, speed, altitude, isFirstTrackingRecord } = globalStore.get();
    if (isFirstTrackingRecord) return;
    const { useImperial } = flagStore.get();
    const { metric, imperial } = valueFormatter('altitude', altitude['EGM96'])
    const compass = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const cardinal = compass[(((heading + 22.5) % 360) / 45) | 0];
    if (sendSbVariableFunction) {
      console.log('Sending rtirl update to Streamer.bot...');
      sendSbVariableFunction(goalDistance, sessionDistance, totalDistance, cardinal, heading.toFixed(0), speed, useImperial ? imperial : metric);
    }
  });

  globalStore.locationData.onChange((locationData) => {
    const { useImperial } = flagStore.get();
    const temp = valueFormatter('temperature', locationData.value.main.temp)
    if (sendSbTempFunction) {
      console.log('Sending rtirl update to Streamer.bot...');
      sendSbTempFunction(useImperial ? temp.imperial : temp.metric);
    }
  });
};

handleSbWebSocket();

export default handleSbWebSocket;
