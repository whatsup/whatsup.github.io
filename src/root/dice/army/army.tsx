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
}

export function _Army({ number, color, size }: _ArmyProps) {
    const dices = [] as JSX.Element[]

    for (const i of [5, 6, 7, 8, 1, 2, 3, 4]) {
        if (i <= size) {
            dices.push(
                <g className={_(`slot-${i}`)}>
                    <_Dice number={number} color={color} />
                </g>
            )
        }
    }

    return <g className={_('army')}>{dices}</g>
}
