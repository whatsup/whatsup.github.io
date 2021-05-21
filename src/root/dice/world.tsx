import { Cause, conse, Context, Fractal } from 'whatsup'
import { render } from '@whatsup/jsx'
import { generateMap } from './generator'
import _ from './world.scss'
import { MIN_WORLD_WIDTH, MIN_WORLD_BORDER, MAX_CELL_SIZE, CELL_GAP } from './constants'
import { AreaData, generateAreas } from './painter'

class World extends Cause<JSX.Element> {
    readonly width: number
    readonly height: number
    readonly areas: Area[]

    constructor() {
        super()

        const { width, height, cells } = generateMap(36)

        this.width = width
        this.height = height
        this.areas = generateAreas(cells).map((data) => new Area(data))
    }

    *whatsUp(ctx: Context) {
        ctx.share(this)

        while (true) {
            const areas = [] as JSX.Element[]

            for (const area of this.areas) {
                areas.push(yield* area)
            }

            yield (
                <_World width={this.width} height={this.height}>
                    {areas}
                </_World>
            )
        }
    }
}

class Area extends Fractal<JSX.Element> {
    readonly id: number
    readonly shape: string

    constructor({ id, shape }: AreaData) {
        super()
        this.id = id
        this.shape = shape
    }

    *whatsUp(ctx: Context) {
        while (true) {
            const polygonStyle = {
                fill: `rgb(0 0 241 / 25%)`,
                stroke: `rgb(50 50 50 / 100%)`,
                strokeWidth: 0.1,
                strokeLinejoin: 'round',
                shapeRendering: 'geometricprecision',
                pointerEvents: 'visiblefill',
                cursor: 'pointer',
            }

            yield <path d={this.shape} onClick={() => console.log(this)} style={polygonStyle}></path>
        }
    }
}

interface _WorldProps extends JSX.IntrinsicAttributes {
    width: number
    height: number
}

function _World({ width, height, children }: _WorldProps) {
    const sx = -1
    const sy = -1
    const dx = width + 2.5
    const dy = height * 0.7 + 2
    const viewBox = `${sx},${sy} ${dx},${dy}`
    const style = {
        maxWidth: '100vw',
        maxHeight: '100vh',
    }

    return (
        <svg viewBox={viewBox} style={style}>
            {children}
        </svg>
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
