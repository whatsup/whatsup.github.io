import { Fractal, Context, fractal } from 'whatsup'
import { Game } from './game'
import { AreaData } from './generators/map'
import { generateAreaShape } from './painter'

export class Area extends Fractal<JSX.Element> {
    readonly id: number
    readonly neighbors: Set<number>
    readonly shape: string

    constructor({ id, neighbors, cells }: AreaData) {
        super()
        this.id = id
        this.neighbors = new Set(neighbors)
        this.shape = generateAreaShape(cells)
    }

    *whatsUp(ctx: Context) {
        const game = ctx.get(Game)
        const color = fractal(function* (this: Area, ctx: Context) {
            while (true) {
                for (const player of game.players) {
                    const areas = yield* player.areas

                    if (areas.includes(this.id)) {
                        yield player.color
                        continue
                    }
                }

                throw 'color cannot be determined'
            }
        }, this)

        while (true) {
            const polygonStyle = {
                fill: yield* color,
                stroke: `#333`,
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
