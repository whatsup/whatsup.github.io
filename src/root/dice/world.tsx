import { Cause, Context, Fractal } from 'whatsup'
import { render } from '@whatsup/jsx'
import _ from './world.scss'

const MIN_WORLD_WIDTH = 30 // Cells
const MIN_WORLD_HEIGHT = 20 // Cells
const MIN_WORLD_BORDER = 2 // Cells
const MAX_CELL_SIZE = 60 // px
const CELL_GAP = 1 // px

class World extends Cause<JSX.Element> {
    readonly cellSize: number
    readonly width: number
    readonly height: number
    readonly viewBox: string
    readonly cells: Cell[]

    constructor() {
        super()
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        const cellSize = Math.min(Math.floor(screenWidth / (MIN_WORLD_WIDTH + MIN_WORLD_BORDER * 2)), MAX_CELL_SIZE)
        const width = Math.ceil(screenWidth / (cellSize + CELL_GAP) /* px */) + 1 /* stock */
        const height = Math.ceil(screenHeight / (cellSize * 0.7 + CELL_GAP) /* px */) + 1 /* stock */
        const offsetX = -Math.floor(width / 2)
        const offsetY = -Math.floor(height / 2)
        const offsetXPx = offsetX * (cellSize + CELL_GAP)
        const offsetYPx = offsetY * (cellSize * 0.7 + CELL_GAP)
        const widthPx = width * (cellSize + CELL_GAP)
        const weightPx = height * (cellSize * 0.7 + CELL_GAP)
        const viewBoxX = offsetXPx + (widthPx - screenWidth) / 2
        const viewBoxY = offsetYPx + (weightPx - screenHeight) / 2

        this.cellSize = cellSize
        this.width = width
        this.height = height
        this.viewBox = `${viewBoxX},${viewBoxY} ${screenWidth},${screenHeight}`
        this.cells = []

        for (let x = offsetX; x < offsetX + width; x++) {
            for (let y = offsetY; y < offsetY + height; y++) {
                this.cells.push(new Cell(x, y))
            }
        }
    }

    *whatsUp(ctx: Context) {
        ctx.share(this)

        while (true) {
            const cells = [] as JSX.Element[]

            for (const cell of this.cells) {
                cells.push(yield* cell)
            }

            yield <_World viewBox={this.viewBox}>{cells}</_World>
        }
    }
}

interface _WorldProps extends JSX.IntrinsicAttributes {
    viewBox: string
}

function _World({ viewBox, children }: _WorldProps) {
    return <svg viewBox={viewBox}>{children}</svg>
}

class Cell extends Fractal<JSX.Element> {
    readonly x: number
    readonly y: number

    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
    }

    *whatsUp(ctx: Context) {
        const world = ctx.get(World)
        const { cellSize } = world
        const { x, y } = this

        while (true) {
            yield <_Cell x={x} y={y} size={cellSize}></_Cell>
        }
    }
}

interface _CellProps extends JSX.IntrinsicAttributes {
    x: number
    y: number
    size: number
}

function _Cell({ x, y, size }: _CellProps) {
    const isOdd = y % 2 === 0
    const translateX = isOdd ? x * size + x * CELL_GAP : x * size + x * CELL_GAP + size / 2
    const translateY = y * size * 0.7 + y * CELL_GAP

    //prettier-ignore
    const points = [
        [size * 0.5,          0],
        [      size, size * 0.3],
        [      size, size * 0.7],
        [size * 0.5,       size],
        [         0, size * 0.7],
        [         0, size * 0.3],
    ].join(' ')
    //prettier-ignore
    const style = {
        transform: `translate(${translateX}px,${translateY}px)` ,
        fill: `#eceff1`
    }

    return <polygon points={points} style={style}></polygon>
}

render(new World())
