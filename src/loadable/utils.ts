import { Fractal, isFractal } from '@fract/core'

export async function* connect<T>(Target: Fractal<T>[] | Fractal<Fractal<T>[]>) {
    const items = isFractal(Target) ? yield* Target : Target
    const acc = [] as T[]

    for (const Item of items) {
        acc.push(yield* Item)
    }

    return acc
}
