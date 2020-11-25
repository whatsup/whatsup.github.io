import { Stream } from '@fract/core'

export function* connect<T>(target: any[] | Stream<any[]>) {
    const items = target instanceof Stream ? yield* target : target
    const acc = [] as T[]

    for (const Item of items) {
        acc.push(yield* Item)
    }

    return acc
}
