import { Cause, conse, Context, Fractal } from 'whatsup'
import { render } from '@whatsup/jsx'
import { generateMap } from './generator'
import _ from './world.scss'
import { MIN_WORLD_WIDTH, MIN_WORLD_BORDER, MAX_CELL_SIZE, CELL_GAP } from './constants'
import { generateAreas } from './painter'

class World extends Cause<JSX.Element> {
    readonly cellSize: number
    readonly width: number
    readonly height: number
    readonly viewBox: string
    readonly cells: Cell[]
    readonly data: any
    readonly polygon = conse<any>(null)

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

        const map = generateMap(24)

        this.data = map.cells

        console.log(map.cells)

        window.run = () => {
            const gen = generateAreas(map.cells)
            this.polygon.set(gen)
            console.log(gen)
        }

        setTimeout(window.run, 500)

        for (let x = offsetX; x < offsetX + width; x++) {
            for (let y = offsetY; y < offsetY + height; y++) {
                this.cells.push(new Cell(x, y))
            }
        }

        console.log('Cells length', this.cells.length)
    }

    *whatsUp(ctx: Context) {
        ctx.share(this)

        const area = new Area()

        while (true) {
            const cells = [] as JSX.Element[]

            for (const cell of this.cells) {
                cells.push(yield* cell)
            }

            yield <_World viewBox={this.viewBox}>{yield* area}</_World>
        }
    }
}

class Area extends Fractal<JSX.Element[] | null> {
    *whatsUp(ctx: Context) {
        const world = ctx.get(World)
        const { polygon, cellSize } = world

        while (true) {
            const areas = yield* polygon

            if (areas) {
                const acc = []

                for (let i = 0; i < areas.length; i++) {
                    const area = areas[i]
                    const polygonStyle = {
                        fill: `rgb(0 0 241 / 25%)`,
                        stroke: `rgb(50 50 50 / 100%)`,
                        strokeWidth: 0.1,
                        strokeLinejoin: 'round',
                        shapeRendering: 'geometricprecision',
                        pointerEvents: 'visiblefill',
                        cursor: 'pointer',
                    }

                    const points = area.shape.join(' ')

                    acc.push(<path d={`M ${points} z`} onClick={() => console.log(area)} style={polygonStyle}></path>)
                }

                yield acc
            } else {
                yield null
            }
        }
    }
}

interface _WorldProps extends JSX.IntrinsicAttributes {
    viewBox: string
}

function _World({ viewBox, children }: _WorldProps) {
    return <svg viewBox={'-15,-15 30,30'}>{children}</svg>
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
        const { cellSize, data } = world
        const { x, y } = this

        let color

        if (data[x] !== undefined && data[x][y] !== undefined) {
            color = colors[data[x][y]]
        } else {
            color = '#eceff1'
        }

        while (true) {
            yield <_Cell x={x} y={y} size={cellSize} color={color} onClick={() => console.log(data[x][y])}></_Cell>
        }
    }
}

interface _CellProps extends JSX.IntrinsicAttributes {
    x: number
    y: number
    size: number
    color: string
    onClick: () => void
}

function _Cell({ x, y, size, color, onClick }: _CellProps) {
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

    const style = {
        transform: `translate(${translateX}px,${translateY}px)`,
    }
    const polygonStyle = {
        fill: color, //`#eceff1`,
        pointerEvents: 'all',
    }
    const textStyle = {
        fontSize: '8px',
        pointerEvents: 'none',
        // display: 'none',
    }

    return (
        <g style={style}>
            <polygon points={points} style={polygonStyle} onClick={onClick}></polygon>
            <text dy={size / 2} dx={size / 4} style={textStyle}>
                {x}, {y}
            </text>
        </g>
    )
}

const colors = [
    'aqua',
    'aquamarine',
    'blue',
    'brown',
    'saddlebrown',
    'sandybrown',
    'slateblue',
    'tomato',
    'yellow',
    'yellowgreen',
    'khaki',
    'indigo',
    'lightblue',
    'lightsalmon',
    'maroon',
    'midnightblue',
    'olive',
    'palegreen',
    'rebeccapurple',
    'sandybrown',
    'royalblue',
    'salmon',
    'coral',
    'aqua',
    'aquamarine',
    'blue',
    'brown',
    'saddlebrown',
    'sandybrown',
    'slateblue',
    'tomato',
    'yellow',
    'yellowgreen',
    'khaki',
    'indigo',
    'lightblue',
    'lightsalmon',
    'maroon',
    'midnightblue',
    'olive',
    'palegreen',
    'rebeccapurple',
    'sandybrown',
    'royalblue',
    'salmon',
    'coral',
    'aqua',
    'aquamarine',
    'blue',
    'brown',
    'saddlebrown',
    'sandybrown',
    'slateblue',
    'tomato',
    'yellow',
    'yellowgreen',
    'khaki',
    'indigo',
    'lightblue',
    'lightsalmon',
    'maroon',
    'midnightblue',
    'olive',
    'palegreen',
    'rebeccapurple',
    'sandybrown',
    'royalblue',
    'salmon',
    'coral',
    'aqua',
    'aquamarine',
    'blue',
    'brown',
    'saddlebrown',
    'sandybrown',
    'slateblue',
    'tomato',
    'yellow',
    'yellowgreen',
    'khaki',
    'indigo',
    'lightblue',
    'lightsalmon',
    'maroon',
    'midnightblue',
    'olive',
    'palegreen',
    'rebeccapurple',
    'sandybrown',
    'royalblue',
    'salmon',
    'coral',
    'salmon',
    'coral',
    'aqua',
    'aquamarine',
    'blue',
    'brown',
    'saddlebrown',
    'sandybrown',
    'slateblue',
    'tomato',
    'yellow',
    'yellowgreen',
    'khaki',
    'indigo',
    'lightblue',
    'lightsalmon',
    'maroon',
    'midnightblue',
    'olive',
    'palegreen',
    'rebeccapurple',
    'sandybrown',
    'royalblue',
    'salmon',
    'coral',
]

render(new World())
