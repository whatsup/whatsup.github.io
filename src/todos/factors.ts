import { factor, Fractal } from '@fract/core'
import { FilterMode } from './const'

export enum Mode {
    Data,
    Jsx,
}

export const MODE = factor<Mode>(Mode.Jsx)

export const FILTER = factor<Fractal<FilterMode>>()

export const CHANGE_FILTER = factor<(mode: FilterMode) => any>()
