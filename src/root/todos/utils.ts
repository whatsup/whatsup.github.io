import { Fractal } from '@fract/core'

export function* connect<T>(target: any[] | Fractal<any[]>) {
    const items = target instanceof Fractal ? yield* target : target
    const acc = [] as T[]

    for (const Item of items) {
        acc.push(yield* Item)
    }

    return acc
}
