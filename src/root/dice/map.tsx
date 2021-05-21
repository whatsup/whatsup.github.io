import _ from './world.scss'
import { Fractal, Context } from 'whatsup'
import { MapData } from './generators/map'
import { Area } from './area'

export class GameMap extends Fractal<JSX.Element> {
    readonly width: number
    readonly height: number
    readonly areas: Area[]

    constructor({ width, height, areas }: MapData) {
        super()

        this.width = width
        this.height = height
        this.areas = areas.map((data) => new Area(data))
    }

    *whatsUp(ctx: Context) {
        ctx.share(this)

        while (true) {
            const areas = [] as JSX.Element[]

            for (const area of this.areas) {
                areas.push(yield* area)
            }

            yield (
                <_GameMap width={this.width} height={this.height}>
                    {areas}
                </_GameMap>
            )
        }
    }
}

interface _GameMapProps extends JSX.IntrinsicAttributes {
    width: number
    height: number
}

function _GameMap({ width, height, children }: _GameMapProps) {
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

// const colors = [
//     'aqua',
//     'aquamarine',
//     'blue',
//     'brown',
//     'saddlebrown',
//     'sandybrown',
//     'slateblue',
//     'tomato',
//     'yellow',
//     'yellowgreen',
//     'khaki',
//     'indigo',
//     'lightblue',
//     'lightsalmon',
//     'maroon',
//     'midnightblue',
//     'olive',
//     'palegreen',
//     'rebeccapurple',
//     'sandybrown',
//     'royalblue',
//     'salmon',
//     'coral',
//     'aqua',
//     'aquamarine',
//     'blue',
//     'brown',
//     'saddlebrown',
//     'sandybrown',
//     'slateblue',
//     'tomato',
//     'yellow',
//     'yellowgreen',
//     'khaki',
//     'indigo',
//     'lightblue',
//     'lightsalmon',
//     'maroon',
//     'midnightblue',
//     'olive',
//     'palegreen',
//     'rebeccapurple',
//     'sandybrown',
//     'royalblue',
//     'salmon',
//     'coral',
//     'aqua',
//     'aquamarine',
//     'blue',
//     'brown',
//     'saddlebrown',
//     'sandybrown',
//     'slateblue',
//     'tomato',
//     'yellow',
//     'yellowgreen',
//     'khaki',
//     'indigo',
//     'lightblue',
//     'lightsalmon',
//     'maroon',
//     'midnightblue',
//     'olive',
//     'palegreen',
//     'rebeccapurple',
//     'sandybrown',
//     'royalblue',
//     'salmon',
//     'coral',
//     'aqua',
//     'aquamarine',
//     'blue',
//     'brown',
//     'saddlebrown',
//     'sandybrown',
//     'slateblue',
//     'tomato',
//     'yellow',
//     'yellowgreen',
//     'khaki',
//     'indigo',
//     'lightblue',
//     'lightsalmon',
//     'maroon',
//     'midnightblue',
//     'olive',
//     'palegreen',
//     'rebeccapurple',
//     'sandybrown',
//     'royalblue',
//     'salmon',
//     'coral',
//     'salmon',
//     'coral',
//     'aqua',
//     'aquamarine',
//     'blue',
//     'brown',
//     'saddlebrown',
//     'sandybrown',
//     'slateblue',
//     'tomato',
//     'yellow',
//     'yellowgreen',
//     'khaki',
//     'indigo',
//     'lightblue',
//     'lightsalmon',
//     'maroon',
//     'midnightblue',
//     'olive',
//     'palegreen',
//     'rebeccapurple',
//     'sandybrown',
//     'royalblue',
//     'salmon',
//     'coral',
// ]

// render(new World())
