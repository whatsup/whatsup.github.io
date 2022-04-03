import styles from './app.scss'
import { Context, observable, Computed } from 'whatsup'

export class Timer extends Computed<number> {
    constructor(delay: number = 1000) {
        super(function* (ctx: Context) {
            let timeoutId: number
            let value = -1

            try {
                while (true) {
                    timeoutId = window.setTimeout(() => ctx.update(), delay)
                    yield value === 9 ? (value = 0) : ++value
                }
            } finally {
                clearTimeout(timeoutId!)
            }
        })
    }
}

export class Scaler extends Computed<number> {
    constructor() {
        super(function* (ctx: Context) {
            let elapsed = 0
            let rafId: number

            try {
                while (true) {
                    rafId = requestAnimationFrame((e) => ((elapsed = e), ctx.update()))
                    const e = (elapsed / 1000) % 10
                    yield 1 + (e > 5 ? 10 - e : e) / 10
                }
            } finally {
                cancelAnimationFrame(rafId!)
            }
        })
    }
}

function* Dot(ctx: Context) {
    const timer = ctx.get(Timer)
    const hovered = observable(false)

    const onMouseOver = () => hovered.set(true)
    const onMouseOut = () => hovered.set(false)

    while (true) {
        const isHovered = hovered.get()
        const time = timer.get()
        const text = isHovered ? `*${time}*` : time
        const className = styles.dot + (isHovered ? ' ' + styles.hovered : '')

        yield (
            <div className={className} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
                {text}
            </div>
        )
    }
}

function Triangle({ depth }: { depth: number }) {
    return (
        <div className={styles.triangle}>
            <Layer depth={depth} />
            <Layer depth={depth} />
            <Layer depth={depth} />
        </div>
    )
}

function Layer({ depth }: { depth: number }) {
    return depth === 0 ? <Dot /> : <Triangle depth={depth - 1} />
}

export function* App(ctx: Context) {
    const timer = new Timer()
    const scaler = new Scaler()

    ctx.share(timer)

    while (true) {
        const transform = '' // `scaleX(${scaler.get()})`

        yield (
            <section className={styles.container} style={{ transform }}>
                <Layer depth={5} />
            </section>
        )
    }
}
