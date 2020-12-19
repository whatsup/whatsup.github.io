import styles from './screen.scss'
import { List, observable, Observable, list, Fractal, factor, Context } from '@fract/core'
import { render } from '@fract/jsx'

const PixelSize = factor<Observable<number>>()

class Screen extends Fractal<HTMLScreen> {
    readonly width: number
    readonly height: number
    readonly pixelSize = observable(20)
    readonly canvas: Canvas

    constructor(w: number, h: number) {
        super()

        this.width = w
        this.height = h

        this.canvas = new Canvas(w * h)
    }

    *stream(ctx: Context) {
        ctx.set(PixelSize, this.pixelSize)

        while (true) {
            const canvas = yield* this.canvas
            const width = (yield* this.pixelSize) * this.width
            const style = { width }

            yield (
                <div className={styles.screen} style={style}>
                    {canvas}
                </div>
            )
        }
    }
}

type HTMLScreen = JSX.Element

// function HTMLScreen({ children }: FractalJSX.Attributes) {
//     return <div>{children}</div>
// }

class Canvas extends Fractal<HTMLCanvas> {
    readonly pixels: List<Pixel>

    constructor(length: number, colors: Color[] = []) {
        super()

        this.pixels = list(
            Array.from({ length }, (_, i) => {
                const color = i < colors.length ? colors[i] : undefined
                return new Pixel(color)
            })
        )
    }

    *stream() {
        while (true) {
            const pixels = yield* this.pixels
            const html = [] as HTMLPixel[]

            for (const pixel of pixels) {
                html.push(yield* pixel)
            }

            yield <div className={styles.canvas}>{html}</div>
        }
    }

    fill(colors: Color[]) {}
}

type HTMLCanvas = JSX.Element

// function HTMLCanvas({ children }: FractalJSX.Attributes) {
//     return <div>{children}</div>
// }

type Color = string

class Pixel extends Fractal<HTMLPixel> {
    readonly color: Observable<Color>
    readonly htmlBackgroundColor = observable('currentColor')

    constructor(color: Color = 'black') {
        super()

        this.color = observable(color)
    }

    fill(color: Color) {
        this.color.set(color)
    }

    *stream(ctx: Context) {
        const pixelSize = ctx.get(PixelSize)!

        while (true) {
            const backgroundColor = yield* this.color
            const width = yield* pixelSize
            const height = width
            const style = { backgroundColor, width, height }

            yield <div className={styles.pixel} style={style} />
        }
    }
}

type HTMLPixel = JSX.Element

const screen = new Screen(20, 15)

render(screen)
