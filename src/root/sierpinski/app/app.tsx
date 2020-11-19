import styles from './app.scss'
import { Fractal, tmp, Context, factor, fraction } from '@fract/core'

const TIMER = factor<Fractal<number>>()

function layer(depth: number) {
    return depth === 0 ? new Dot() : new Triangle(--depth)
}

function delay(timeout: number) {
    return new Promise((r) => setTimeout(r, timeout))
}

class Timer extends Fractal<number> {
    private pause?: Promise<unknown>

    async *collector() {
        let i = -1

        while (true) {
            yield tmp(i === 9 ? (i = 0) : ++i)
            await (this.pause || (this.pause = delay(1000).then(() => (this.pause = undefined))))
        }
    }
}

class Scaler extends Fractal<number> {
    async *collector() {
        let elapsed = 0

        while (true) {
            const e = (elapsed / 1000) % 10
            yield tmp(1 + (e > 5 ? 10 - e : e) / 10)
            elapsed = await new Promise(requestAnimationFrame)
        }
    }
}

class Dot extends Fractal<JSX.Element> {
    async *collector(ctx: Context) {
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

    async *collector() {
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
    readonly triangle = new Triangle(5)

    async *collector(ctx: Context) {
        ctx.set(TIMER, this.timer)

        while (true) {
            const transform = `scaleX(${yield* this.scaler})`

            yield (
                <div className={styles.container} style={{ transform }}>
                    {yield* this.triangle}
                </div>
            )
        }
    }
}
