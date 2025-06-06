import globalStore from '@store/globalStore.ts';

// Configuration
const SB_TOTAL_DISTANCE_VAR = 'reactTotalDistance';
const SB_SESSION_DISTANCE_VAR = 'reactSessionDistance';
const SB_GOAL_DISTANCE_VAR = 'reactGoalDistance';

// Reference to the sendSbVariable function from App.tsx
let sendSbVariableFunction: (variableName: string, value: number) => void;

// Function to set the reference to the sendSbVariable function
export const setSendSbVariableFunction = (fn: (variableName: string, value: number) => void) => {
  sendSbVariableFunction = fn;
};

// Main handler function
const handleSbWebSocket = () => {
  // Set up listeners for changes to distance values
  globalStore.sessionDistance.onChange((sessionDistance) => {
    if (sendSbVariableFunction) {
      console.log('Sending session distance update to Streamer.bot...');
      sendSbVariableFunction(SB_SESSION_DISTANCE_VAR, sessionDistance.value);
    }
  });

  globalStore.totalDistance.onChange((totalDistance) => {
    if (sendSbVariableFunction) {
      console.log('sending total distance update to Streamer.bot...');
      sendSbVariableFunction(SB_TOTAL_DISTANCE_VAR, totalDistance.value);
    }
  });

  globalStore.goalDistance.onChange((goalDistance) => {
    if (sendSbVariableFunction) {
      console.log('sending goal distance update to Streamer.bot...');
      sendSbVariableFunction(SB_GOAL_DISTANCE_VAR, goalDistance.value);
    }
  });
};

handleSbWebSocket();

export default handleSbWebSocket;
