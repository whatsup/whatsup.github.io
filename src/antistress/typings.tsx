import React from 'react'
import { Color } from './const'

export type AppData = {
    currentColor: Color
    tree: TreeData
}

export type TreeData = Color | TreeData[]

export interface Handlers {
    onMouseDown?: (e?: React.MouseEvent) => any
    onMouseUp?: (e?: React.MouseEvent) => any
    onTouchStart?: (e?: React.TouchEvent) => any
    onTouchEnd?: (e?: React.TouchEvent) => any
}
