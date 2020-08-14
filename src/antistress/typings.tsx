import React from 'react'

export interface Handlers {
    onMouseDown?: (e?: React.MouseEvent) => any
    onMouseUp?: (e?: React.MouseEvent) => any
    onTouchStart?: (e?: React.TouchEvent) => any
    onTouchEnd?: (e?: React.TouchEvent) => any
}
