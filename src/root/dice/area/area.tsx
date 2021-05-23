import { Fractal, Context, fractal, conse, Conse } from 'whatsup'
import { Army, _Army } from '../army'
import { COLORS } from '../constants'
import { Game } from '../game'
import { AreaData } from '../generators/map'
import { calculateAreaCenter, generateAreaShape } from './utils'

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number)[]) => classNames.map((name) => styles[name]).join(' ')
}

const _ = style('area')

export class Area extends Fractal<JSX.Element> {
    readonly id: number
    readonly neighbors: Set<number>
    readonly shape: string
    readonly center: [number, number]
    readonly army: Army

    constructor({ id, neighbors, cells }: AreaData) {
        super()
        this.id = id
        this.neighbors = new Set(neighbors)
        this.shape = generateAreaShape(cells)
        this.center = calculateAreaCenter(cells)
        this.army = new Army(this)
    }

    *whatsUp(ctx: Context) {
        const game = ctx.get(Game)

        while (true) {
            const { number } = yield* game.getPlayerByAreaId(this.id)
            const color = COLORS[number - 1]

            yield <_Area shape={this.shape} color={color} />
        }
    }
}

interface _AreaProps extends JSX.IntrinsicAttributes {
    shape: string
    color: string
}

function _Area({ shape, color }: _AreaProps) {
    return <path d={shape} className={_('area', color)}></path>
}
