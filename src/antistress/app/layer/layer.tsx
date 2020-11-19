import styles from './layer.scss'
import { fraction, Fractal, Fraction, Context } from '@fract/core'
import { Color } from 'antistress/const'
import { playSplitSound, playFillSound } from 'antistress/sounds'
import { CURRENT_COLOR, MODE, Mode } from 'antistress/factors'

export type LayerData = Color | LayerData[]

export class Layer extends Fractal<any> {
    readonly nested: Fraction<LayerData | Fractal<LayerData | JSX.Element>[]>

    constructor(data: LayerData) {
        super()
        this.nested = fraction(Array.isArray(data) ? data.map((d) => new Layer(d)) : data)
    }

    collector(ctx: Context) {
        switch (ctx.get(MODE)) {
            case Mode.Data:
                return workInDataMode.call(this)
            case Mode.Jsx:
                return workInJsxMode.call(this, ctx)
        }
        throw 'Unknown MODE'
    }

    async *convertNestedToColorAndChildren(): AsyncGenerator<any, { color: Color; children: JSX.Element[] }> {
        const nested = yield* this.nested

        if (Array.isArray(nested)) {
            const children = [] as JSX.Element[]

            for (const child of nested) {
                children.push(yield* child as Fractal<JSX.Element>)
            }

            return { color: Color.None, children }
        }
        return { color: nested, children: [] as JSX.Element[] }
    }
}

async function* workInDataMode(this: Layer): AsyncGenerator<LayerData> {
    while (true) {
        const nested = yield* this.nested

        if (Array.isArray(nested)) {
            const children = [] as LayerData[]

            for (const child of nested) {
                children.push(yield* child as Fractal<Color | LayerData[]>)
            }

            yield children
        } else {
            yield nested
        }
    }
}

async function* workInJsxMode(this: Layer, ctx: Context): AsyncGenerator<JSX.Element> {
    const key = (~~(Math.random() * 1e8)).toString(16)
    const currentColor = ctx.get(CURRENT_COLOR)!

    while (true) {
        const { color, children } = yield* this.convertNestedToColorAndChildren()

        let splitTimerId = 0

        const mouseDownHandler = (e: any) => {
            splitTimerId = setTimeout(() => {
                this.nested.set(
                    children.length ? Color.Default : [new Layer(color), new Layer(color), new Layer(color)]
                )
                playSplitSound()
                splitTimerId = 0
            }, 300)
            e.stopPropagation()
        }

        const mouseUpHandler = (e: any) => {
            if (splitTimerId && !children.length) {
                this.nested.set(currentColor.get())
                playFillSound()
            }
            clearTimeout(splitTimerId)

            e.stopPropagation()
        }

        yield (
            <Container key={key} color={color} onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler}>
                {children}
            </Container>
        )
    }
}

type Props = { children?: any; onMouseDown: (e: any) => void; onMouseUp: (e: any) => void }

function Container({ children, color, onMouseDown, onMouseUp }: Props & { color: string }) {
    const style = {
        backgroundColor: color,
    }

    return (
        <div className={styles.container} style={style} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            {children}
        </div>
    )
}
