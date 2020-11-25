import { factor } from '@fract/core'

export enum Mode {
    Data,
    Jsx,
}

export const MODE = factor<Mode>(Mode.Jsx)
