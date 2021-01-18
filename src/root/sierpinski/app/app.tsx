import styles from './app.scss'
import { Fractal, Context, Cause, conse } from 'whatsup'

function layer(depth: number) {
    return depth === 0 ? new Dot() : new Triangle(--depth)
}

export class Timer extends Cause<number> {
    private delay: number

    constructor(delay: number = 1000) {
        super()
        this.delay = delay
    }

    *whatsUp(ctx: Context) {
        let timeoutId: number
        let value = -1

        try {
            while (true) {
                timeoutId = window.setTimeout(() => ctx.update(), this.delay)
                yield value === 9 ? (value = 0) : ++value
            }
        } finally {
            if (timeoutId!) {
                clearTimeout(timeoutId!)
            }
        }
    }
}

class Scaler extends Cause<number> {
    *whatsUp(ctx: Context) {
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
    }
}

class Dot extends Fractal<JSX.Element> {
    *whatsUp(ctx: Context) {
        const timer = ctx.find(Timer)!
        const Hovered = conse(false)

        const onMouseOver = () => Hovered.set(true)
        const onMouseOut = () => Hovered.set(false)

        while (true) {
            const hovered = yield* Hovered
            const time = yield* timer
            const text = hovered ? `*${time}*` : time
            const className = styles.dot + (hovered ? ' ' + styles.hovered : '')

            yield (
                <div className={className} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
                    {text}
                </div>
            )
        }
    }
}

class Triangle extends Fractal<JSX.Element> {
    private one: Dot | Triangle
    private two: Dot | Triangle
    private thr: Dot | Triangle

    constructor(depth: number) {
        super()
        this.one = layer(depth)
        this.two = layer(depth)
        this.thr = layer(depth)
    }

    *whatsUp() {
        while (true) {
            yield (
                <div className={styles.triangle}>
                    {yield* this.one}
                    {yield* this.two}
                    {yield* this.thr}
                </div>
            )
        }
    }
}

export class App extends Fractal<JSX.Element> {
    readonly timer = new Timer()
    readonly scaler = new Scaler()
    readonly triangle = new Triangle(5);

    *whatsUp(ctx: Context) {
        ctx.share(this.timer)

        while (true) {
            const transform = `scaleX(${yield* this.scaler})`

            yield (
                <section className={styles.container} style={{ transform }}>
                    {yield* this.triangle}
                </section>
            )
        }
    }
}
