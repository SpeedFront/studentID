export function returnIfCorrectType<T>(value: T, type: string, regex?: RegExp) {
    if (
        typeof value !== type ||
        (typeof value === 'string' && value.length <= 0) ||
        (regex && !regex.test(`${value?.toString ? value.toString() : value}`))
    ) {
        return undefined;
    } else {
        return value;
    }
}
