import styles from './screen.scss'
import {
    observable,
    Observable,
    Fractal,
    factor,
    Context,
    transaction,
    List,
    list,
    computed,
    fractal,
    Stream,
} from '@fract/core'
import { render } from '@fract/jsx'

const PixelSize = factor<Observable<number>>()
const Shapes = factor<List<Shape>>()

class Scene extends Fractal<JSX.Element> {
    readonly width: number
    readonly height: number
    readonly canvas: Canvas
    readonly shapes: List<Shape>

    constructor(w: number, h: number) {
        super()

        this.width = w
        this.height = h
        this.canvas = new Canvas(w, h)
        this.shapes = list([])
    }

    *stream(ctx: Context) {
        ctx.set(Shapes, this.shapes)

        while (true) {
            yield yield* this.canvas
        }
    }

    add(shape: Shape) {
        this.shapes.insert(shape)
    }

    delete(shape: Shape) {
        this.shapes.delete(shape)
    }
}

class Canvas extends Fractal<HTMLScreen> {
    readonly width: number
    readonly height: number
    readonly pixelSize = observable(5)
    readonly pixels: Pixel[]

    constructor(w: number, h: number) {
        super()

        this.width = w
        this.height = h

        this.pixels = Array.from({ length: w * h }, (_, i) => {
            const x = i % w
            const y = Math.floor(i / w)

            return new Pixel(x, y)
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
}

abstract class Shape {
    abstract intersect(x: number, y: number): Generator<never, boolean>

    readonly x: Observable<number>
    readonly y: Observable<number>
    readonly depth: Observable<number>
    readonly color: Observable<string>

    constructor(color = 'transparent') {
        this.x = observable(0)
        this.y = observable(0)
        this.depth = observable(0)
        this.color = observable(color)
    }

    move(ox: number, oy: number) {
        const x = this.x.get() + ox
        const y = this.y.get() + oy

        this.moveTo(x, y)
    }

    moveTo(x: number, y: number) {
        this.x.set(x)
        this.y.set(y)
    }
}

class Rect extends Shape {
    readonly width: Observable<number>
    readonly height: Observable<number>

    constructor(width: number, height: number, color?: string) {
        super(color)

        this.width = observable(width)
        this.height = observable(height)
    }

    *intersect(x: number, y: number) {
        const ox = yield* this.x
        const oy = yield* this.y
        const w = yield* this.width
        const h = yield* this.height

        return ox < x && x <= ox + w && oy < y && y <= oy + h
    }
}

type HTMLScreen = JSX.Element

class Pixel extends Fractal<HTMLPixel> {
    readonly x: number
    readonly y: number

    constructor(x: number, y: number) {
        super()

        this.x = x
        this.y = y
    }

    *stream(ctx: Context) {
        const { x, y } = this
        const shapes = ctx.get(Shapes)!
        const pixelSize = ctx.get(PixelSize)!
        const currentShape = computed(
            function* () {
                let current: Shape | null = null
                let currDepth = Infinity

                for (const shape of yield* shapes) {
                    if (yield* shape.intersect(x, y)) {
                        const depth = yield* shape.depth

                        if (depth < currDepth) {
                            currDepth = depth
                            current = shape
                        }
                    }
                }

                return current
            },
            { thisArg: this }
        )
        const color = computed(
            function* () {
                while (true) {
                    const currShape = yield* currentShape

                    if (currShape) {
                        yield yield* currShape.color
                        continue
                    }

                    yield 'black'
                }
            },
            { thisArg: this }
        )

        while (true) {
            const backgroundColor = yield* color
            const width = yield* pixelSize
            const height = width
            const style = { backgroundColor, width, height }

            yield <div className={styles.pixel} style={style} />
        }
    }
}

type HTMLPixel = JSX.Element

const scene = new Scene(40, 25)

render(scene)
//
declare var window: any

const rect = new Rect(10, 6)

rect.x.set(6)
rect.y.set(11)
rect.color.set('red')

scene.add(rect)

window.scene = scene
window.rect = rect
