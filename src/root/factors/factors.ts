import { factor } from '@fract/core'

export enum Mode {
    Json,
    Edit,
    View,
}

export const MODE = factor<Mode>()
