export type ObjectWithNullsReplaced<T> = T extends null
    ? undefined
    : T extends object
    ? { [K in keyof T]: ObjectWithNullsReplaced<T[K]> }
    : T;

export function replaceNullWithUndefined<T>(obj: T): ObjectWithNullsReplaced<T> | undefined {
    type Obj = ObjectWithNullsReplaced<T>;
    if (obj === null) {
        return undefined;
    }

    if (typeof obj !== 'object') {
        return undefined;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => replaceNullWithUndefined(item)) as Obj;
    }

    const result: any = {};

    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            result[key] = replaceNullWithUndefined(obj[key]);
        }
    }

    return result as Obj;
}
