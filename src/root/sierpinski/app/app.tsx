import styles from './app.scss'
import { Fractal, RootContext, factor, Computed, observable, Context } from '@fract/core'

const TIMER = factor<Timer>()

function layer(depth: number) {
    return depth === 0 ? new Dot() : new Triangle(--depth)
}

export class Timer extends Computed<number> {
    private delay: number
    private value = 0

    constructor(delay: number = 1000) {
        super()
        this.delay = delay
    }

    *stream(ctx: RootContext) {
        let timeoutId: number

        try {
            while (true) {
                const { value } = this

                timeoutId = window.setTimeout(() => ctx.update(), this.delay)

                yield value

                this.value = value === 9 ? 0 : value + 1
            }
        } finally {
            if (timeoutId!) {
                clearTimeout(timeoutId!)
            }
        }
    }
}

class Scaler extends Computed<number> {
    *stream(ctx: RootContext) {
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
    *stream(ctx: Context) {
        const Timer = ctx.get(TIMER)!
        const Hovered = observable(false)

        const onMouseOver = () => Hovered.set(true)
        const onMouseOut = () => Hovered.set(false)

        while (true) {
            const hovered = yield* Hovered
            const timer = yield* Timer
            const text = hovered ? `*${timer}*` : timer
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

    *stream() {
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

    *stream(ctx: Context) {
        ctx.set(TIMER, this.timer)

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
