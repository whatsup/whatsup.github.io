import { conse, Conse, Context, Fractal } from 'whatsup'
import { Area } from '../area/area'
import { COLORS } from '../constants'
import { _Dice } from '../dice'
import { Game } from '../game'
import { ArmyData } from '../generators'

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number)[]) => classNames.map((name) => styles[name]).join(' ')
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
            const { number } = yield* game.getPlayerByAreaId(this.area.id)
            const size = yield* game.getArmySizeByAreaId(this.area.id)
            const color = COLORS[number - 1]

            yield <_Army position={this.area.center} color={color} size={size} number={number} />
        }
    }
}

interface _ArmyProps extends JSX.IntrinsicAttributes {
    number: 1 | 2 | 3 | 4 | 5 | 6
    color: string
    size: number
    position: [number, number]
}

export function _Army({ number, color, size, position }: _ArmyProps) {
    const dices = [] as JSX.Element[]
    const [x, y] = position
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
        <g className={_('army')} style={style}>
            {dices}
        </g>
    )
}
