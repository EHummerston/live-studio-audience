export function get<T>(key: string): T | undefined {
    const value = localStorage.getItem(key);

    if (value === null) {
        return undefined;
    }

    return JSON.parse(value) as T;
}

export function set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}
