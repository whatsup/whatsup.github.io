import { Fractal, Context, fractal, conse, Conse, Event } from 'whatsup'
import { Army, _Army } from '../army'
import { COLORS } from '../constants'
import { Game } from '../game'
import { AreaData } from '../generators/map'
import { calculateAreaCenter, generateAreaShape } from './utils'

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number | boolean)[]) =>
        classNames
            .filter((name) => typeof name === 'string' || typeof name === 'number')
            .map((name) => styles[name as string | number])
            .join(' ')
}

const _ = style('area')

export class AreaClickEvent extends Event {
    readonly area: Area

    constructor(area: Area) {
        super()
        this.area = area
    }
}

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
        const onClick = () => ctx.dispatch(new AreaClickEvent(this))

        while (true) {
            const { number } = yield* game.yiePlayerByAreaId(this.id)
            const attackerArea = yield* game.yieAttakerArea()
            const defenderArea = yield* game.yieDefenderArea()
            const selected = attackerArea === this || defenderArea === this
            const color = COLORS[number - 1]

            yield <_Area shape={this.shape} color={color} selected={selected} onClick={onClick} />
        }
    }
}

interface _AreaProps extends JSX.IntrinsicAttributes {
    shape: string
    color: string
    selected: boolean
    onClick: () => void
}

function _Area({ shape, color, selected, onClick }: _AreaProps) {
    const className = _('area', color, selected && 'selected')

    return <path className={className} d={shape} onClick={onClick}></path>
}
