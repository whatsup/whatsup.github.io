import { _Dice } from '../dice'

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number)[]) => classNames.map((name) => styles[name]).join(' ')
}

const _ = style('army')

interface _ArmyProps extends JSX.IntrinsicAttributes {
    number: 1 | 2 | 3 | 4 | 5 | 6
    color: string
    size: number
    coords: [number, number]
}

export function _Army({ number, color, size, coords }: _ArmyProps) {
    const dices = [] as JSX.Element[]
    const [x, y] = coords
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
