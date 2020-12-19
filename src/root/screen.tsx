import styles from './screen.scss'
import { observable, Observable, Fractal, factor, Context, transaction } from '@fract/core'
import { render } from '@fract/jsx'

const PixelSize = factor<Observable<number>>()

class Canvas extends Fractal<HTMLScreen> {
    readonly width: number
    readonly height: number
    readonly pixelSize = observable(20)
    readonly pixels: Pixel[]

    constructor(w: number, h: number, colors: Color[] = []) {
        super()

        this.width = w
        this.height = h
        this.pixels = Array.from({ length: w * h }, (_, i) => {
            const color = i < colors.length ? colors[i] : undefined
            return new Pixel(color)
        })
    }

    *stream(ctx: Context) {
        ctx.set(PixelSize, this.pixelSize)

        while (true) {
            const width = (yield* this.pixelSize) * this.width
            const style = { width }
            const children = [] as HTMLPixel[]

            for (const pixel of this.pixels) {
                children.push(yield* pixel)
            }

            yield (
                <div className={styles.screen} style={style}>
                    {children}
                </div>
            )
        }
    }

    fill(fillMap: FillMap) {
        transaction(() => {
            let i = 0

            for (const item of fillMap) {
                if (typeof item === 'number') {
                    i += item
                    continue
                }

                this.pixels[i++].color.set(item)
            }
        })
    }

    fillRect(x: number, y: number, w: number, h: number, color: Color) {
        const fillMap = this.fillRectMap(x, y, w, h, color)
        this.fill(fillMap)
    }

    *fillRectMap(x: number, y: number, w: number, h: number, color: Color) {
        yield y * this.width

        while (--h) {
            yield x

            let i = w

            while (i--) {
                yield color
            }

            yield this.width - (x + w)
        }
    }
}

type FillMap = Generator<Color | number>

type HTMLScreen = JSX.Element

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

const canvas = new Canvas(20, 15)

render(canvas)
//
;(window as any).canvas = canvas

canvas.fillRect(2, 4, 13, 7, 'red')
