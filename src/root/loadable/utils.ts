import { Stream } from '@fract/core'

export function* connect<T>(target: T[] | Stream<T[]>) {
    const items = target instanceof Stream ? yield* target : target
    const acc = [] as T[]

    for (const item of items) {
        if (item instanceof Stream) {
            acc.push(yield* item)
        } else {
            acc.push(item)
        }
    }

    return acc
}
