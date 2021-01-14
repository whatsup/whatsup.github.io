import { factor } from 'whatsup'

export enum Mode {
    View,
    Edit,
    Json,
}

export const MODE = factor<Mode>()
