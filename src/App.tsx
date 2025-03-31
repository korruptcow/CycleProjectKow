import {useEffect, useState} from 'react';

import Map from '@components/Map';
import Metrics from '@components/Metrics';
import Neighbourhood from '@components/Neighbourhood';
import Rotator from '@components/Rotator';

import useListener from '@hooks/useListener';

import './App.scss';
import useWebSocket from "react-use-websocket";
import keyStore from "@store/keyStore.ts";
import globalStore from "@store/globalStore.ts";
import configStore from "@store/configStore.ts";
import Distance from "@components/Distance";
import Speed from "@components/Speed";
import Prices from "@components/Prices";

function App() {
    const [lastSentDistance, setLastSentDistance] = useState<number | null>(null);

    const {sendMessage, lastJsonMessage: command} = useWebSocket('wss://irc-ws.chat.twitch.tv:443', {
        onOpen: () => {
            console.info('Opened web socket connection to Twitch IRC');
            authenticateAndJoin();
        },
        onMessage: (message) => handleMessage(message),
        onClose: () => console.info('WebSocket connection closed'),
        onError: (event) => console.error('WebSocket error', event),
        retryOnError: true,
        shouldReconnect: () => true,
        reconnectAttempts: 1_000_000,
        reconnectInterval: 1000,
    });

    const handleMessage = (message: MessageEvent) => {
        const data = message.data;
        // Handle PING messages from Twitch
        if (data.startsWith('PING :')) {
            const pingMessage = data.substring(6);
            sendPong(pingMessage);
            return;
        }
        // Log messages to check for capabilities and joining success
        if (data.includes('CAP * ACK')) {
            console.info('Capabilities request succeeded.');
        }

        if (data.includes(' 001 ')) {
            console.info('Successfully logged in.');
        }

        if (data.includes(`:End of /NAMES list\r\n`)) {
            console.info(`Successfully joined the channel #${keyStore.twitchChannelName.get()}.`);
        }

        parseCommand(data);
    };

    const sendChatMessage = (message: string) => {
        sendMessage(`PRIVMSG #${keyStore.twitchChannelName.get()} :${message}`);
    };

    const sendPong = (message: string) => {
        console.debug('Sending PONG...');
        sendMessage(`PONG :${message}`);
    };

    const parseCommand = (data: string) => {
        const commandMatch = data.match(/:(\w+)!.* PRIVMSG #\w+ :!(\w+)(?: (\w+))?(?: ?(-?\d+(?:\.\d*)?)?)/);
        if (commandMatch) {
            const modCommands = [
                configStore.commands.get().addModerator,
                configStore.commands.get().removeModerator,
                configStore.commands.get().pauseTracking,
                configStore.commands.get().unpauseTracking,
                configStore.commands.get().resetCurrentSession,
                configStore.commands.get().hideChatUpdate,
                configStore.commands.get().showChatUpdate,
                configStore.commands.get().hideMap,
                configStore.commands.get().showMap
            ];
            const [_, userName, commandType, target, value] = commandMatch;
            if (modCommands.includes(commandType)) {
                if (keyStore.twitchUserName.get() === userName || globalStore.modsWhitelist.peek().includes(userName)) {
                    const command = { type: commandType, targetUser: target , userName: userName};
                    executeModCommand(command);
                }
            } else if (globalStore.modsWhitelist.peek().includes(userName) && value != undefined) {
                const command = { type: commandType, target, value: parseFloat(value) };
                executeCommand(command);
            }
        }
    };

    const executeModCommand = (command: { type: string; targetUser: string; userName: string }) => {
        console.log('Executing mod command', command);
        switch (command.type) {
            case configStore.commands.get().addModerator:
                if (command.targetUser?.trim() && !globalStore.modsWhitelist.peek().includes(command.targetUser)) {
                    addMod(command.targetUser.toLowerCase())
                    sendChatMessage(`${command.userName} added ${command.targetUser} to the whitelist.`);
                    console.info(`${command.userName}  added ${command.targetUser} to the whitelist.`);
                }
                break;
            case configStore.commands.get().removeModerator:
                if (command.targetUser?.trim() &&globalStore.modsWhitelist.peek().includes(command.targetUser)) {
                    removeMod(command.targetUser.toLowerCase())
                    sendChatMessage(`${command.userName} removed ${command.targetUser} from the whitelist.`);
                    console.info(`${command.userName} removed ${command.targetUser} from the whitelist.`);
                }
                break;
            case configStore.commands.get().pauseTracking:
                globalStore.trackingPaused.set(true);
                sendChatMessage(`tracking paused by ${command.userName}.`);
                console.info(`tracking paused by ${command.userName}.`);
                break;
            case configStore.commands.get().unpauseTracking:
                globalStore.trackingPaused.set(false);
                sendChatMessage(`tracking unpaused by ${command.userName}.`);
                console.info(`tracking unpaused by ${command.userName}.`);
                break;
            case configStore.commands.get().resetCurrentSession:
                globalStore.goalDistance.set(globalStore.goalDistance.get() + globalStore.sessionDistance.get())
                globalStore.totalDistance.set(globalStore.totalDistance.get() - globalStore.sessionDistance.get())
                globalStore.sessionDistance.set(0);
                sendChatMessage(`Today's session restarted by ${command.userName}.`);
                console.info(`Today's session restarted by ${command.userName}.`);
                break;
            case configStore.commands.get().hideMap:
                globalStore.hideMap.set(true);
                sendChatMessage(`Map hidden by ${command.userName}.`);
                console.info(`Map hidden by ${command.userName}.`);
                break;
            case configStore.commands.get().showMap:
                globalStore.hideMap.set(false);
                sendChatMessage(`Map shown by ${command.userName}.`);
                console.info(`Map shown by ${command.userName}.`);
                break;
            case configStore.commands.get().hideChatUpdate:
                globalStore.hideChatUpdate.set(true);
                sendChatMessage(`Update messages deactivated by ${command.userName}.`);
                console.info(`Update messages deactivated by ${command.userName}.`);
                break;
            case configStore.commands.get().showChatUpdate:
                globalStore.hideChatUpdate.set(false);
                sendChatMessage(`Update messages activated by ${command.userName}.`);
                console.info(`Update messages activated by ${command.userName}.`);
                break;
            default:
                console.warn('Unknown mod command type:', command.type);
        }
    };

    const executeCommand = (command: { type: string; target: string; value: number }) => {
        console.log('Executing command', command);
        switch (command.type) {
            case configStore.commands.get().addAmountKm:
                if (command.target === configStore.targets.get().goalDistance) {
                    globalStore.goalDistance.set(globalStore.goalDistance.get() + command.value);
                    sendChatMessage(`Add ${command.value} km/mi to the goal.`);
                } else if (command.target === configStore.targets.get().totalDistance) {
                    globalStore.totalDistance.set(globalStore.totalDistance.get() + command.value);
                    sendChatMessage(`Add ${command.value} km/mi to the total.`);
                } else if (command.target === configStore.targets.get().sessionDistance) {
                    globalStore.sessionDistance.set(globalStore.sessionDistance.get() + command.value);
                    sendChatMessage(`Add ${command.value} km/mi to today's trip.`);
                }
                break;
            case configStore.commands.get().minusAmountKm:
                if (command.target === configStore.targets.get().goalDistance) {
                    globalStore.goalDistance.set(globalStore.goalDistance.get() - command.value);
                    sendChatMessage(`Removed ${command.value} km/mi from goal.`);
                } else if (command.target === configStore.targets.get().totalDistance) {
                    globalStore.totalDistance.set(globalStore.totalDistance.get() - command.value);
                    sendChatMessage(`Removed ${command.value} km/mi from total.`);
                } else if (command.target === configStore.targets.get().sessionDistance) {
                    globalStore.sessionDistance.set(globalStore.sessionDistance.get() - command.value);
                    sendChatMessage(`Removed ${command.value} km/mi to today's trip.`);
                }
                break;
            case configStore.commands.get().updateRate:
                if (command.target === configStore.targets.get().tip) {
                    globalStore.donationRatio.set(command.value);
                    sendChatMessage(`Distance per 1${globalStore.currency.get()} ${command.value} km/mi.`);
                } else if (command.target === configStore.targets.get().sub) {
                    globalStore.subRatio.set(command.value);
                    sendChatMessage(`Distance per 1 sub ${command.value} km/mi.`);
                }
                break;
            // add cases here
            default:
                console.warn('Unknown command type:', command.type);
        }
    };

    // Function to add a mod to the whitelist and notify observers
    function addMod(mod: string) {
        globalStore.modsWhitelist.set([...globalStore.modsWhitelist.get(), mod]);
    }

    // Function to remove a mod from the whitelist and notify observers
    function removeMod(mod: string) {
        globalStore.modsWhitelist.set(globalStore.modsWhitelist.get().filter(m => m !== mod));
    }

    const authenticateAndJoin = () => {
        const twitchUserToken = keyStore.twitchUserToken.get();
        const twitchChannelName = keyStore.twitchChannelName.get()
        const twitchUserName = keyStore.twitchUserName.get();

        sendMessage(`PASS oauth:${twitchUserToken}`);
        sendMessage(`NICK ${twitchUserName}`);
        sendMessage(`JOIN #${twitchChannelName}`);
        sendMessage('CAP REQ :twitch.tv/commands twitch.tv/tags');
    };
    // Propagate events to global state
    useListener();

    // Run handlers
    useEffect(() => {
        import('@handlers/handleDateTime')
        import('@handlers/handleDistance')
        import('@handlers/handleSpeed')
        import('@handlers/handleCyclingCadence')
        import('@handlers/handleMapZoomInterval')
        import('@handlers/handleStreamElements')
        import('@handlers/handleTheme')
        import('@handlers/handleWeather')
        import('@handlers/handleNeighbourhood')
        const intervalId = setInterval(() => {
            const currentDistance = globalStore.goalDistance.get();

            if (currentDistance !== lastSentDistance && !globalStore.hideChatUpdate.get()) {
                const formattedDistance = currentDistance.toFixed(2);
                sendChatMessage(`${formattedDistance} km/mi left to reach the goal !`);
                setLastSentDistance(currentDistance);
            }
        }, 10 * 60 * 1000); // 10 minutes

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [ command, lastSentDistance, sendChatMessage ])
    return (
        <div className="react-rtirl-container">
            <Map/>
            <Metrics/>
            <Distance/>
            <Speed/>
            <Prices/>
            <Neighbourhood/>
            <Rotator/>
        </div>
    );
}




export default App;
