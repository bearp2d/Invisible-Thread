export function GetRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function GetRandomBool() {
    return Math.floor(Math.random() + 0.5) > 0;
}