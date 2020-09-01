import React from 'react'
import { Fractal } from '@fract/core'
import { Block } from './block'
import { flatten } from '../utils'

interface Params {
    key: string
    TagName: Fractal<string>
    Width: Fractal<string>
    Height: Fractal<string>
    Border: Fractal<string>
    BorderRadius: Fractal<string>
    Background: Fractal<string>
    Children: Fractal<Block[]>
}

export async function* View({ key, TagName, Width, Height, Border, BorderRadius, Background, Children }: Params) {
    while (true) {
        const Tag = (yield* TagName) as any
        const style = {
            width: yield* Width,
            height: yield* Height,
            border: yield* Border,
            borderRadius: yield* BorderRadius,
            background: yield* Background,
        }
        const children = yield* flatten(Children)

        yield (
            <Tag key={key} style={style}>
                {children}
            </Tag>
        )
    }
}
