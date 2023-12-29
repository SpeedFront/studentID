export type ObjectWithNullsReplaced<T> = T extends null
    ? undefined
    : T extends object
    ? { [K in keyof T]: ObjectWithNullsReplaced<T[K]> }
    : T;

export function replaceNullWithUndefined<T extends object | null | undefined>(obj: T) {
    type Obj = ObjectWithNullsReplaced<T>;
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return undefined;
    }

    const result: Obj = {} as any;

    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const v = obj[key];
        }
    }

    return result;
}
