import { Fractal } from '@fract/core'
import { Block } from './block'
import { flatten } from '../utils'

interface Params {
    TagName: Fractal<string>
    Width: Fractal<string>
    Height: Fractal<string>
    Border: Fractal<string>
    BorderRadius: Fractal<string>
    Background: Fractal<string>
    Children: Fractal<Block[]>
}

export async function* Data({ TagName, Width, Height, Border, BorderRadius, Background, Children }: Params) {
    while (true) {
        yield {
            tag: yield* TagName,
            width: yield* Width,
            height: yield* Height,
            border: yield* Border,
            borderRadius: yield* BorderRadius,
            background: yield* Background,
            children: yield* flatten(Children),
        }
    }
}
