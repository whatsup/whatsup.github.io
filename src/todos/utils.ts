import { Fractal } from '@fract/core'

export async function* connect<T>(target: Fractal<T>[] | Fractal<Fractal<T>[]>) {
    const items = target instanceof Fractal ? yield* target : target
    const acc = [] as T[]

    for (const Item of items) {
        acc.push(yield* Item)
    }

    return acc
}
