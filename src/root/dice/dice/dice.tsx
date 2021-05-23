import { side, corner, marking } from './shape'

const _ = style('dice')

interface _DiceProps extends JSX.IntrinsicAttributes {
    number: 1 | 2 | 3 | 4 | 5 | 6
    color: string
}

export function _Dice({ number, color }: _DiceProps) {
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
            <g className={_('marking')}>
                <path className={_('right')} d={marking[number].right} />
                <path className={_('left')} d={marking[number].left} />
                <path className={_('top')} d={marking[number].top} />
            </g>
        </g>
    )
}

function style(path: string) {
    const styles = require(`./${path}.scss`).default
    return (...classNames: (string | number)[]) => classNames.map((name) => styles[name]).join(' ')
}
