import { factor, Fraction } from '@fract/core'
import { Block } from './block'

export enum Branch {
    View,
    Style,
    Tree,
    Data,
    NameAndTag,
}

export const BRANCH = factor(Branch.View)
export const EDITABLE = factor<Fraction<{ Target: Block }>>()
export const CHANGE_EDITABLE = factor<(target: any) => void>()
