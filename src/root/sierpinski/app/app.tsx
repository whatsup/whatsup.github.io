import styles from './app.scss'
import { Fractal, Context, factor, fraction } from '@fract/core'

const TIMER = factor<Fractal<number>>()

function layer(depth: number) {
    return depth === 0 ? new Dot() : new Triangle(--depth)
}

export class Timer extends Fractal<number> {
    private active = false
    private contexts = new Set<Context>()
    private delay: number
    private data = 0

    constructor(timeout: number = 1000) {
        super()
        this.delay = timeout
    }

    *collector(context: Context) {
        this.contexts.add(context)

        let iBoss = false
        let timeoutId: number

        if (!this.active) {
            this.active = true
            iBoss = true
        }

        try {
            while (true) {
                const { data, delay } = this

                if (iBoss) {
                    timeoutId = window.setTimeout(() => this.update(data + 1), delay)
                }

                yield data
            }
        } finally {
            if (timeoutId!) {
                clearTimeout(timeoutId!)
            }

            this.active = false
            this.contexts.delete(context)
        }
    }

    private update(data: number) {
        this.data = data === 10 ? 0 : data

        for (const context of this.contexts) {
            context.update()
        }
    }
}

class Scaler extends Fractal<number> {
    *collector(ctx: Context) {
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
    *collector(ctx: Context) {
        const Timer = ctx.get(TIMER)!
        const Hovered = fraction(false)

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

    *collector() {
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

    *collector(ctx: Context) {
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
