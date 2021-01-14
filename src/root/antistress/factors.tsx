import { factor, Conse } from 'whatsup'
import { Color } from './const'

export enum Mode {
    Data,
    Jsx,
}

export const MODE = factor(Mode.Jsx)
export const CURRENT_COLOR = factor<Conse<Color>>()
