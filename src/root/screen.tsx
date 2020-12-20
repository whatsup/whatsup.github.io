import styles from './screen.scss'
import {
    conse,
    Conse,
    Fractal,
    factor,
    Context,
    transaction,
    List,
    list,
    cause,
    fractal,
    Stream,
    watch,
    Event,
} from 'whatsup-js'
import { render } from '@whatsup-js/jsx'

class SelectionEvent extends Event {
    constructor(readonly set: Set<Pixel>) {
        super()
    }
}

const PixelSize = factor<Conse<number>>()
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

    *whatsUp(ctx: Context) {
        ctx.set(Shapes, this.shapes)
        ctx.on(SelectionEvent, (e) => this.add(new Path()))

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
    readonly pixelSize = conse(5)
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

    getPixel(x: number, y: number) {
        return this.pixels[x + y * this.width]
    }

    *whatsUp(ctx: Context) {
        ctx.set(PixelSize, this.pixelSize)

        const cursorX = conse(0)
        const cursorY = conse(0)
        const isMouseDown = conse(false)
        const way = cause(function* (this: Canvas) {
            while (true) {
                const x = yield* cursorX
                const y = yield* cursorY
                yield this.getPixel(x, y)
            }
        })
        const selected = cause(function* (this: Canvas) {
            let set: Set<Pixel> | undefined

            while (true) {
                if (!(yield* isMouseDown)) {
                    if (set!) {
                        yield set
                    }
                    set = undefined
                    continue
                }
                if (!set!) {
                    set = new Set()
                }

                const pix = yield* way
                set.add(pix)
            }
        })

        const disposeSelectionEventChannel = watch(selected, (set: Set<Pixel>) => ctx.dispath(new SelectionEvent(set)))

        const setXY = ctx.defer(function* (this: any, _: Context, xy: [number, number]) {
            return transaction(() => {
                cursorX.set(xy[0])
                cursorY.set(xy[1])
            })
        })
        const getXYFromEvent = ctx.defer(function* (this: Canvas, _: Context, e: any) {
            const pixelSize = yield* this.pixelSize
            const rect = e.currentTarget!.getBoundingClientRect()
            const x = Math.floor((e.clientX - rect.left) / pixelSize)
            const y = Math.floor((e.clientY - rect.top) / pixelSize)

            return [x, y]
        })
        const getCurrentPixel = (ctx.defer(function* (this: Canvas) {
            const x = yield* cursorX
            const y = yield* cursorY
            const pix = this.getPixel(x, y)
            return { pix }
        }) as any) as () => { pix: Pixel }

        const onMouseMove = ctx.defer(function* (this: Canvas, _: Context, e: any) {
            const xy = getXYFromEvent(e) as any
            setXY(xy)
            getCurrentPixel().pix.mousemove()
        })
        const onMouseEnter = ctx.defer(function* (this: Canvas) {
            getCurrentPixel().pix.mouseenter()
        })
        const onMouseLeave = ctx.defer(function* (this: Canvas) {
            getCurrentPixel().pix.mouseleave()
        })
        const onMouseDown = ctx.defer(function* (this: Canvas) {
            isMouseDown.set(true)
            getCurrentPixel().pix.mousedown()
        })
        const onMouseUp = ctx.defer(function* (this: Canvas) {
            isMouseDown.set(false)
            getCurrentPixel().pix.mouseup()
        })
        const onClick = ctx.defer(function* (this: Canvas) {
            getCurrentPixel().pix.click()
        })

        while (true) {
            const width = (yield* this.pixelSize) * this.width
            const style = { width }
            const children = [] as HTMLPixel[]

            for (const pixel of this.pixels) {
                children.push(yield* pixel)
            }

            yield (
                <div
                    onClick={onClick}
                    onMouseMove={onMouseMove}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    className={styles.screen}
                    style={style}
                >
                    {children}
                </div>
            )
        }
    }
}

abstract class Shape {
    abstract intersect(x: number, y: number): Generator<never, boolean>

    readonly x: Conse<number>
    readonly y: Conse<number>
    readonly depth: Conse<number>
    readonly color: Conse<string>

    constructor(color = 'transparent') {
        this.x = conse(0)
        this.y = conse(0)
        this.depth = conse(0)
        this.color = conse(color)
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
    readonly width: Conse<number>
    readonly height: Conse<number>

    constructor(width: number, height: number, color?: string) {
        super(color)

        this.width = conse(width)
        this.height = conse(height)
    }

    *intersect(x: number, y: number) {
        const ox = yield* this.x
        const oy = yield* this.y
        const w = yield* this.width
        const h = yield* this.height

        return ox < x && x <= ox + w && oy < y && y <= oy + h
    }
}

class Path extends Shape {
    readonly pixels: List<Pixel>

    constructor(start: Pixel, color: string) {
        super(color)
        this.pixels = list([start])
    }

    readonly map = cause(
        function* (this: Path) {
            while (true) {
                const acc = new Map() as Map<number, Map<number, Pixel>>

                for (const pixel of yield* this.pixels) {
                    if (!acc.has(pixel.x)) {
                        acc.set(pixel.x, new Map())
                    }

                    const submap = acc.get(pixel.x)!

                    if (!submap.has(pixel.y)) {
                        submap.set(pixel.y, pixel)
                    }
                }

                yield acc
            }
        },
        { thisArg: this }
    );

    *intersect(x: number, y: number) {
        const map = yield* this.map
        return map.has(x) && map.get(x)!.has(y)
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

    *whatsUp(ctx: Context) {
        const { x, y } = this
        const shapes = ctx.get(Shapes)!
        const pixelSize = ctx.get(PixelSize)!
        const currentShape = cause(
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
        const color = cause(
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

    click() {
        //console.log('Click', this)
    }

    mousemove() {
        //console.log('Mousemove', this)
    }

    mouseenter() {
        //console.log('mouseenter', this)
    }
    mouseleave() {
        //console.log('mouseleave', this)
    }
    mousedown() {
        //console.log('mousedown', this)
    }
    mouseup() {
        //console.log('mouseup', this)
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
