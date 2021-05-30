import { conse, Conse, Context, Fractal } from 'whatsup'
import { Area } from '../area/area'
import { COLORS } from '../constants'
import { _Dice } from '../dice'
import { Game } from '../game'
import { shadow } from './shape'

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number | boolean)[]) =>
        classNames
            .filter((name) => typeof name === 'string' || typeof name === 'number')
            .map((name) => styles[name as string | number])
            .join(' ')
}

const _ = style('army')

export class Army extends Fractal<JSX.Element> {
    readonly area: Area

    constructor(area: Area) {
        super()
        this.area = area
    }

    *whatsUp(ctx: Context) {
        const game = ctx.get(Game)

        while (true) {
            const { number } = yield* game.yiePlayerByAreaId(this.area.id)
            const attackerArea = yield* game.yieAttakerArea()
            const defenderArea = yield* game.yieDefenderArea()
            const hidden =
                (attackerArea && defenderArea && attackerArea !== this.area && defenderArea !== this.area) || false
            const size = yield* game.getArmySizeByAreaId(this.area.id)
            const color = COLORS[number - 1]

            yield <_Army position={this.area.center} color={color} size={size} number={number} hidden={hidden} />
        }
    }
}

interface _ArmyProps extends JSX.IntrinsicAttributes {
    number: 1 | 2 | 3 | 4 | 5 | 6
    color: string
    size: number
    hidden: boolean
    position: [number, number]
}

export function _Army({ number, color, size, position, hidden }: _ArmyProps) {
    const dices = [] as JSX.Element[]
    const [x, y] = position
    const shadowLength = (size >= 4 ? 4 : size) as 1 | 2 | 3 | 4
    const className = _('army', hidden && 'hidden')
    const style = {
        transform: `matrix(1, 0, 0, 1, ${x}, ${y})`,
    }

    for (const i of [5, 6, 7, 8, 1, 2, 3, 4]) {
        if (i <= size) {
            dices.push(
                <g className={_(`slot-${i}`)}>
                    <_Dice number={number} color={color} />
                </g>
            )
        }
    }

    return (
        <g className={className} style={style}>
            <path d={shadow[shadowLength]} className={_('shadow')} />
            {dices}
        </g>
    )
}
