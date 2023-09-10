export function replaceValues(value: string, replacer?: Record<string, string>): string {
    if (!replacer) {
        return value;
    }

    let replacedValue = value;

    for (const key in replacer) {
        if (Object.prototype.hasOwnProperty.call(replacer, key)) {
            const replaceKey = `[${key}]`;
            const replaceValue = replacer[key];

            replacedValue = replacedValue.replaceAll(replaceKey, replaceValue);
        }
    }

    return replacedValue;
}
