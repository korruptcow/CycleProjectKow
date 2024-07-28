
export function saveToLocalStorage(key: string, value: number) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to local storage', error);
    }
}

export function loadFromLocalStorage(key: string): number {
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
