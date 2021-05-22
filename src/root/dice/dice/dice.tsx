import _ from './dice.scss'
import { side, corner, number } from './shape'

interface _DiceProps extends JSX.IntrinsicAttributes {
    value: 1 | 2 | 3 | 4 | 5 | 6
    color: string
}

export function _Dice({ value, color }: _DiceProps) {
    return (
        <g className={cn('dice')}>
            <g>
                <path className={cn(color, 'side', 'right')} d={side.right} />
                <path className={cn(color, 'side', 'left')} d={side.left} />
                <path className={cn(color, 'side', 'top')} d={side.top} />
            </g>
            <g>
                <path className={cn(color, 'corner', 'center')} d={corner.center} />
                <path className={cn(color, 'corner', 'left')} d={corner.left} />
                <path className={cn(color, 'corner', 'right')} d={corner.right} />
                <path className={cn(color, 'corner', 'bottom')} d={corner.bottom} />
            </g>
            <g>
                <path className={cn('number', 'right')} d={number[value].right} />
                <path className={cn('number', 'left')} d={number[value].left} />
                <path className={cn('number', 'top')} d={number[value].top} />
            </g>
        </g>
    )
}

function cn(...classNames: (string | number)[]) {
    return classNames.map((name) => _[name]).join(' ')
}
