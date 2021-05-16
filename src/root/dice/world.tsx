import { Cause, Context, Fractal } from 'whatsup'
import { render } from '@whatsup/jsx'
import _ from './world.scss'

const MIN_WORLD_WIDTH = 30 // Cells
const MIN_WORLD_HEIGHT = 20 // Cells
const WORLD_BORDER = 2 // Cells
const MAX_CELL_SIZE = 60 // px
const CELL_GAP = 1 // px

class World extends Cause<JSX.Element> {
    readonly screenWidth: number
    readonly screenHeight: number
    readonly cellSize: number
    readonly width: number
    readonly height: number
    readonly pxWidth: number
    readonly pxHeight: number
    readonly pxCropX: number
    readonly pxCropY: number
    readonly cells: Cell[]

    constructor() {
        super()
        this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        this.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.cellSize = Math.min(Math.floor(this.screenWidth / (MIN_WORLD_WIDTH + WORLD_BORDER * 2)), MAX_CELL_SIZE)
        this.width = Math.ceil(this.screenWidth / (this.cellSize + CELL_GAP) /* px */) + 1 /* stock */
        this.height = Math.ceil(this.screenHeight / (this.cellSize * 0.7 + CELL_GAP) /* px */) + 1 /* stock */
        this.pxWidth = this.width * (this.cellSize + CELL_GAP)
        this.pxHeight = this.height * (this.cellSize * 0.7 + CELL_GAP)

        const offsetX = -Math.floor(this.width / 2)
        const offsetY = -Math.floor(this.height / 2)
        const pxOffsetX = offsetX * (this.cellSize + CELL_GAP)
        const pxOffsetY = offsetY * (this.cellSize * 0.7 + CELL_GAP)

        this.pxCropX = pxOffsetX + (this.pxWidth - this.screenWidth) / 2
        this.pxCropY = pxOffsetY + (this.pxHeight - this.screenHeight) / 2
        this.cells = []

        for (let x = offsetX; x < offsetX + this.width; x++) {
            for (let y = offsetY; y < offsetY + this.height; y++) {
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

            yield (
                <_World width={this.screenWidth} height={this.screenHeight} cropX={this.pxCropX} cropY={this.pxCropY}>
                    {cells}
                </_World>
            )
        }
    }
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

interface _WorldProps extends JSX.IntrinsicAttributes {
    width: number
    height: number
    cropX: number
    cropY: number
}

function _World({ width, height, cropX, cropY, children }: _WorldProps) {
    const viewBox = [
        [cropX, cropY],
        [width, height],
    ].join(' ')

    return <svg viewBox={viewBox}>{children}</svg>
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
