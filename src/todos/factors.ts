import { factor, Fractal } from '@fract/core'
import { FilterMode } from './const'

export enum Mode {
    Data,
    Jsx,
    Service,
}

export const MODE = factor<Mode>()

export const FILTER = factor<Fractal<FilterMode>>()

export const CHANGE_FILTER = factor<(mode: FilterMode) => any>()
