
export const mapFromObject = (object: any): Map<string, any> => {
    const map: Map<string, any> = new Map();
    if (object !== undefined) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                map.set(key, object[key]);
            };
        }
    }
    return map;
}

export const objectFromMap = (map: any): any => {
    const object: any = {};
    map.forEach((value: any, key: string) => {
        object[key] = value;
    });
    return object;
}

export const generateRandomString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}