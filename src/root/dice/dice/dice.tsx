import { side, corner, number } from './shape'

const _ = style('dice')

interface _DiceProps extends JSX.IntrinsicAttributes {
    value: 1 | 2 | 3 | 4 | 5 | 6
    color: string
}

export function _Dice({ value, color }: _DiceProps) {
    return (
        <g className={_('dice')}>
            <g>
                <path className={_(color, 'side', 'right')} d={side.right} />
                <path className={_(color, 'side', 'left')} d={side.left} />
                <path className={_(color, 'side', 'top')} d={side.top} />
            </g>
            <g>
                <path className={_(color, 'corner', 'center')} d={corner.center} />
                <path className={_(color, 'corner', 'left')} d={corner.left} />
                <path className={_(color, 'corner', 'right')} d={corner.right} />
                <path className={_(color, 'corner', 'bottom')} d={corner.bottom} />
            </g>
            <g>
                <path className={_('number', 'right')} d={number[value].right} />
                <path className={_('number', 'left')} d={number[value].left} />
                <path className={_('number', 'top')} d={number[value].top} />
            </g>
        </g>
    )
}

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number)[]) => classNames.map((name) => styles[name]).join(' ')
}
