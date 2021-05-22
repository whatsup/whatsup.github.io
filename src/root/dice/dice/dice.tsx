import { side, corner, number } from './shape'

const _ = style('dice')

interface _DiceProps extends JSX.IntrinsicAttributes {
    value: 1 | 2 | 3 | 4 | 5 | 6
    color: string
}

export function _Dice({ value, color }: _DiceProps) {
    return (
        <g className={_('dice', color)}>
            <g className={_('side')}>
                <path className={_('right')} d={side.right} />
                <path className={_('left')} d={side.left} />
                <path className={_('top')} d={side.top} />
            </g>
            <g className={_('corner')}>
                <path className={_('center')} d={corner.center} />
                <path className={_('left')} d={corner.left} />
                <path className={_('right')} d={corner.right} />
                <path className={_('bottom')} d={corner.bottom} />
            </g>
            <g className={_('number')}>
                <path className={_('right')} d={number[value].right} />
                <path className={_('left')} d={number[value].left} />
                <path className={_('top')} d={number[value].top} />
            </g>
        </g>
    )
}

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number)[]) => classNames.map((name) => styles[name]).join(' ')
}
