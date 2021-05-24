import _ from './world.scss'
import { Fractal, Context } from 'whatsup'
import { MapData } from './generators/map'
import { Area } from './area/area'
import { _Dice } from './dice'
import { SCALE_X, SCALE_Y } from './constants'
import { _Army } from './army/army'
import { ArmyData } from './generators'

function coord(x: number, y: number) {
    return x + y * 10000000
}

export class GameMap extends Fractal<JSX.Element> {
    readonly width: number
    readonly height: number
    readonly areas: Area[]

    constructor({ width, height, areas }: MapData) {
        super()

        this.width = width
        this.height = height
        this.areas = areas.map((data) => new Area(data)).sort((a, b) => coord(...a.center) - coord(...b.center))
    }

    *whatsUp(ctx: Context) {
        //ctx.share(this)

        while (true) {
            const armies = [] as JSX.Element[]
            const areas = [] as JSX.Element[]

            for (const area of this.areas) {
                areas.push(yield* area)
                armies.push(yield* area.army)
            }

            yield (
                <_GameMap width={this.width} height={this.height}>
                    {areas}
                    {armies}
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
    const sx = -1 * SCALE_X
    const sy = -1 * SCALE_Y
    const dx = (width + 2.5) * SCALE_X
    const dy = (height * 0.7 + 2) * SCALE_Y
    const viewBox = `${sx},${sy} ${dx},${dy}`
    const style = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        backgroundColor: '#263238',
    }

    return (
        <svg viewBox={viewBox} style={style}>
            {children}
        </svg>
    )
}
