import { factor } from '@fract/core'

export enum Mode {
    View,
    Edit,
    Json,
}

export const MODE = factor<Mode>()
