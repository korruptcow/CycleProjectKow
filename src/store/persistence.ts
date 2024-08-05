import keyStore from "@store/keyStore.ts";

export function saveToLocalStorage(key: string, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to local storage', error);
    }
}

export function loadFloatFromLocalStorage(key: string): number {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return 0;
        }
        return parseFloat(serializedValue);
    } catch (error) {
        console.error('Error loading from local storage', error);
        return 0;
    }
}

export function loadListFromLocalStorage(key: string): string[] {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return [keyStore.twitchUserName.get()];
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error('Error loading from local storage', error);
        return [keyStore.twitchUserName.get()];
    }
}
