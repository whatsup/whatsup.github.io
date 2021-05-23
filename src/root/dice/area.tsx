import { Fractal, Context, fractal } from 'whatsup'
import { _Army } from './army/army'
import { Game } from './game'
import { AreaData } from './generators/map'
import { calculateAreaCenter, generateAreaShape } from './painter'

export class Area extends Fractal<JSX.Element> {
    readonly id: number
    readonly neighbors: Set<number>
    readonly shape: string
    readonly center: [number, number]

    constructor({ id, neighbors, cells }: AreaData) {
        super()
        this.id = id
        this.neighbors = new Set(neighbors)
        this.shape = generateAreaShape(cells)
        this.center = calculateAreaCenter(cells)
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
                strokeWidth: 1,
                strokeLinejoin: 'round',
                shapeRendering: 'geometricprecision',
                pointerEvents: 'visiblefill',
                cursor: 'pointer',
            }

            yield (
                <g>
                    <path
                        d={this.shape}
                        onClick={() => {
                            console.log(this)
                        }}
                        style={polygonStyle}
                    ></path>
                    <_Army coords={this.center} color="red" size={6} number={2} />
                </g>
            )
        }
    }
}
