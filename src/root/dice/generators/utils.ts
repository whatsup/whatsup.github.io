export function getRandomNumberFromRange(start: number, end: number) {
    return start + Math.round(Math.random() * (end - start))
}

export function getRandomItemFromArray<T>(array: T[]) {
    const index = getRandomNumberFromRange(0, array.length - 1)

    return array[index]
}
