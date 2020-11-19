import { factor, Fraction } from '@fract/core'
import { Color } from './const'

export enum Mode {
    Data,
    Jsx,
}

export const MODE = factor(Mode.Jsx)
export const CURRENT_COLOR = factor<Fraction<Color>>()
