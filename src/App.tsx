import { useEffect } from 'react';

import Map from '@components/Map';
import Metrics from '@components/Metrics';
import Neighbourhood from '@components/Neighbourhood';
import Rotator from '@components/Rotator';

import useListener from '@hooks/useListener';

import './App.scss';
import useWebSocket from "react-use-websocket";
import keyStore from "@store/keyStore.ts";
import globalStore from "@store/globalStore.ts";

function App() {

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
            console.info(`Successfully joined the channel #${keyStore.twitchUserName.get()}.`);
        }

        parseCommand(data);
    };

    const sendPong = (message: string) => {
        console.debug('Sending PONG...');
        sendMessage(`PONG :${message}`);
    };

    const parseCommand = (data: string) => {
        const commandMatch = data.match(/:(\w+)!.* PRIVMSG #\w+ :!(\w+)(?: (\w+))?(?: (\w+))?(?: (\d+(\.\d+)?))?/);
        if (commandMatch) {
            const [_, userName, commandType, target, value] = commandMatch;
            if (commandType === 'mod' || commandType === 'unmod') {
                if (keyStore.twitchUserName.get() === userName || globalStore.modsWhitelist.get().includes(userName)) {
                    const command = { type: commandType, targetUser: target };
                    executeModCommand(command);
                }
            } else if (globalStore.modsWhitelist.get().includes(userName)) {
                const command = { type: commandType, target, value: parseFloat(value) };
                executeCommand(command);
            }
        }
    };

    const authenticateAndJoin = () => {
        const twitchUserToken = keyStore.twitchUserToken.get();
        const twitchUserName = keyStore.twitchUserName.get();

        sendMessage(`PASS oauth:${twitchUserToken}`);
        sendMessage(`NICK ${twitchUserName}`);
        sendMessage(`JOIN #${twitchUserName}`);
        sendMessage('CAP REQ :twitch.tv/commands twitch.tv/tags');
    };
    // Propagate events to global state
    useListener();

    // Run handlers
    useEffect(() => {
        import('@handlers/handleDateTime')
        import('@handlers/handleDistance')
        import('@handlers/handleMapZoomInterval')
        import('@handlers/handleStreamElements')
        import('@handlers/handleTheme')
        import('@handlers/handleWeather')
        import('@handlers/handleNeighbourhood')
    }, [ command ])
    return (
        <div className="react-rtirl-container">
            <Map/>
            <Metrics/>
            <Neighbourhood/>
            <Rotator/>
        </div>
    );
}


const executeModCommand = (command: { type: string; targetUser: string }) => {
    console.log('Executing mod command', command);
    switch (command.type) {
        case 'mod':
            if (!globalStore.modsWhitelist.get().includes(command.targetUser)) {
                globalStore.modsWhitelist.get().push(command.targetUser);
                console.info(`Added ${command.targetUser} to the whitelist.`);
            }
            break;
        case 'unmod':
            if (globalStore.modsWhitelist.get().includes(command.targetUser)) {
                const existingWhitelist = globalStore.modsWhitelist.get();
                const index = existingWhitelist.indexOf(command.targetUser);
                existingWhitelist.splice(index,1);
                console.info(`Removed ${command.targetUser} from the whitelist.`);
            }
            break;
        default:
            console.warn('Unknown mod command type:', command.type);
    }
};

const executeCommand = (command: { type: string; target: string; value: number }) => {
    console.log('Executing command', command);
    switch (command.type) {
        case 'add':
            if (command.target === 'goalDistance') {
                globalStore.goalDistance.set(globalStore.goalDistance.get() + command.value);
            } else if (command.target === 'totalDistance') {
                globalStore.totalDistance.set(globalStore.totalDistance.get() + command.value);
            }
            break;
        case 'minus':
            if (command.target === 'goalDistance') {
                globalStore.goalDistance.set(globalStore.goalDistance.get() - command.value);
            } else if (command.target === 'totalDistance') {
                globalStore.totalDistance.set(globalStore.totalDistance.get() - command.value);
            }
            break;
        default:
            console.warn('Unknown command type:', command.type);
    }
};

export default App;
