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
    whatsUp,
    Event,
    Cause,
    Mutator,
} from 'whatsup'

// class SelectionEvent extends Event {
//     constructor(readonly set: Set<Pixel>) {
//         super()
//     }
// }

// const PixelSize = factor<Conse<number>>()
// const Shapes = factor<List<Shape>>()

// class Scene extends Fractal<JSX.Element> {
//     readonly width: number
//     readonly height: number
//     readonly canvas: Canvas
//     readonly shapes: List<Shape>

//     constructor(w: number, h: number) {
//         super()

//         this.width = w
//         this.height = h
//         this.canvas = new Canvas(w, h)
//         this.shapes = list([])
//     }

//     *whatsUp(ctx: Context) {
//         ctx.set(Shapes, this.shapes)

//         while (true) {
//             yield yield* this.canvas
//         }
//     }

//     add(shape: Shape) {
//         this.shapes.insert(shape)
//     }

//     delete(shape: Shape) {
//         this.shapes.delete(shape)
//     }
// }

// class Canvas extends Fractal<HTMLScreen> {
//     readonly width: number
//     readonly height: number
//     readonly pixelSize = conse(5)
//     readonly pixels: Pixel[]

//     constructor(w: number, h: number) {
//         super()

//         this.width = w
//         this.height = h

//         this.pixels = Array.from({ length: w * h }, (_, i) => {
//             const x = i % w
//             const y = Math.floor(i / w)

//             return new Pixel(x, y)
//         })
//     }

//     getPixel(x: number, y: number) {
//         return this.pixels[x + y * this.width]
//     }

//     *whatsUp(ctx: Context) {
//         ctx.set(PixelSize, this.pixelSize)

//         const cursorX = conse(0)
//         const cursorY = conse(0)
//         const isMouseDown = conse(false)
//         const way = cause(function* (this: Canvas) {
//             while (true) {
//                 const x = yield* cursorX
//                 const y = yield* cursorY
//                 yield this.getPixel(x, y)
//             }
//         })

//         const setXY = ctx.defer(function* (this: any, _: Context, xy: [number, number]) {
//             return transaction(() => {
//                 cursorX.set(xy[0])
//                 cursorY.set(xy[1])
//             })
//         })
//         const getXYFromEvent = ctx.defer(function* (this: Canvas, _: Context, e: any) {
//             const pixelSize = yield* this.pixelSize
//             const rect = e.currentTarget!.getBoundingClientRect()
//             const x = Math.floor((e.clientX - rect.left) / pixelSize)
//             const y = Math.floor((e.clientY - rect.top) / pixelSize)

//             return [x, y]
//         })
//         const getCurrentPixel = (ctx.defer(function* (this: Canvas) {
//             const x = yield* cursorX
//             const y = yield* cursorY
//             const pix = this.getPixel(x, y)
//             return { pix }
//         }) as any) as () => { pix: Pixel }

//         const onMouseMove = ctx.defer(function* (this: Canvas, _: Context, e: any) {
//             const xy = getXYFromEvent(e) as any
//             setXY(xy)
//             getCurrentPixel().pix.mousemove()
//         })
//         const onMouseEnter = ctx.defer(function* (this: Canvas) {
//             getCurrentPixel().pix.mouseenter()
//         })
//         const onMouseLeave = ctx.defer(function* (this: Canvas) {
//             getCurrentPixel().pix.mouseleave()
//         })
//         const onMouseDown = ctx.defer(function* (this: Canvas) {
//             isMouseDown.set(true)
//             getCurrentPixel().pix.mousedown()
//         })
//         const onMouseUp = ctx.defer(function* (this: Canvas) {
//             isMouseDown.set(false)
//             getCurrentPixel().pix.mouseup()
//         })
//         const onClick = ctx.defer(function* (this: Canvas) {
//             getCurrentPixel().pix.click()
//         })

//         while (true) {
//             const width = (yield* this.pixelSize) * this.width
//             const style = { width }
//             const children = [] as HTMLPixel[]

//             for (const pixel of this.pixels) {
//                 children.push(yield* pixel)
//             }

//             yield (
//                 <div
//                     onClick={onClick}
//                     onMouseMove={onMouseMove}
//                     onMouseEnter={onMouseEnter}
//                     onMouseLeave={onMouseLeave}
//                     onMouseDown={onMouseDown}
//                     onMouseUp={onMouseUp}
//                     className={styles.screen}
//                     style={style}
//                 >
//                     {children}
//                 </div>
//             )
//         }
//     }
// }
/*
фрактал - это когда ты понимаешь 
что в этом месте будут размножаться миры, 
но тебе кровь из носа нужно сохранить контекст
*/

class EqualSetFilter<T> extends Mutator<Set<T>> {
    constructor(readonly set: Set<T>) {
        super()
    }

    mutate(set: Set<T>) {
        if (!set || this.set.size !== set.size) {
            return this.set
        }
        for (const item of this.set) {
            if (!set.has(item)) {
                return this.set
            }
        }

        return set
    }
}

function equalSet<T>(set: Set<T>) {
    return new EqualSetFilter(set)
}

class EqualArrFilter<T> extends Mutator<T[]> {
    constructor(readonly arr: T[]) {
        super()
    }

    mutate(arr: T[]) {
        if (!arr || this.arr.length !== arr.length) {
            return this.arr
        }
        for (let i = 0; i < this.arr.length; i++) {
            if (arr[i] !== this.arr[i]) {
                return this.arr
            }
        }

        return arr
    }
}

function equalArr<T>(arr: T[]) {
    return new EqualArrFilter(arr)
}

interface Foton {
    color: string
}

class Thread extends Fractal<Foton> {
    readonly layers = fractal<Set<Layer>>(
        function* (this: Thread, ctx: Context) {
            const thread = this
            const matrix = ctx.get(MatrixQuery)

            if (!matrix) {
                throw 'Matrix not exist'
            }

            while (true) {
                yield equalSet(
                    yield* matrix.say(function* (this: Matrix) {
                        const layers = new Set<Layer>()

                        /*
                        в матрице каждый сам берет себе все что ему нужно
                        и только для частых или защищенных запросов
                        в узле реализуются новые методы
                        */

                        for (const layer of yield* this.layers) {
                            if ((yield* layer).has(thread)) {
                                layers.add(layer)
                            }
                        }

                        return layers
                    })
                )
            }
        },
        { thisArg: this }
    );

    *whatsUp(ctx: Context) {
        // возвращает себя тлько через фильтры

        while (true) {
            let foton = {} as Foton

            for (const layer of yield* this.layers) {
                foton = yield* layer.portal(foton)
            }

            yield foton
        }
    }
}

abstract class Layer extends Fractal<Set<Thread>> {
    abstract portal(foton: Foton): Generator<never, Foton>
}

class Display extends Fractal<void> {
    readonly width: number
    readonly height: number
    readonly eye: Eye

    constructor(w: number, h: number) {
        // TODO add param pixelCtor
        super()

        this.width = w
        this.height = h
        this.eye = new Eye(w * h, w)
    }

    *whatsUp() {
        const container = document.getElementById('app')!
        const element = document.createElement('div')

        element.style.setProperty('font-size', '0')
        element.style.setProperty('width', `${this.width * 20}px`)
        element.style.setProperty('height', `${this.height * 20}px`)

        container.append(element)

        try {
            while (true) {
                const elements = yield* this.eye

                element.innerText = ''
                element.append(...elements)

                yield
            }
        } finally {
            debugger
            element.remove()
        }
    }
}

class HTMLPixelMutator extends Mutator<HTMLDivElement> {
    readonly attributes: Map<string, string>

    constructor(foton: Foton) {
        super()
        this.attributes = new Map(Object.entries(foton))
    }

    mutate(element: HTMLDivElement | undefined) {
        if (!element) {
            element = document.createElement('div')
            element.style.setProperty('background-color', 'currentColor')
            element.style.setProperty('width', '20px')
            element.style.setProperty('height', '20px')
            element.style.setProperty('display', 'inline-block')
        }
        for (const [attr, value] of this.attributes) {
            element.style.setProperty(attr, value)
        }
        return element
    }
}

class Eye extends Fractal<HTMLDivElement[]> {
    readonly matrix: Matrix
    readonly retina: Fractal<HTMLPixelMutator>[]

    constructor(length: number, width: number) {
        super()

        const matrix = new Matrix(width, length / width)

        this.matrix = matrix
        this.retina = Array.from({ length }, (_, i) =>
            fractal(function* () {
                while (true) {
                    const fotons = yield* matrix

                    yield new HTMLPixelMutator(fotons[i])
                }
            })
        )
    }

    *whatsUp() {
        while (true) {
            const items = []

            for (const item of this.retina) {
                items.push(yield* item)
            }

            yield (equalArr(items) as any) as HTMLDivElement[]

            // let i = 0

            // for (const foton of yield* this.matrix) {
            //     this.pixels[i++].fire(foton)
            // }

            // const view = new Set<T>()

            // for (const pixel of this.pixels) {
            //     view.add(yield* pixel)
            // }

            // yield (equalSet(view) as any) as Set<T>
            // eye sleep for the next loop
        }
    }
}

class Matrix extends Fractal<Foton[]> {
    *whatsUp(ctx: Context) {
        ctx.set(MatrixQuery, this)

        while (true) {
            const fotons = [] as Foton[]

            for (const thread of this.threads) {
                fotons.push(yield* thread)
            }

            yield fotons
        }
    }

    readonly layers = list<Layer>([])
    readonly threads: Thread[] = []

    readonly width: number
    readonly height: number

    constructor(w: number, h: number) {
        super()
        this.width = w
        this.height = h
        this.threads = Array.from({ length: w * h }, () => new Thread())
    }

    *say(generator: (this: this) => Generator<any>) {
        return yield* generator.call(this)
    }

    getThread(index: number) {
        const { threads } = this

        if (index >= threads.length) {
            throw `Invalid thread index ${index}`
        }

        return this.threads[index]
    }
}

const MatrixQuery = factor<Matrix>()

class Rect extends Layer {
    readonly x: Conse<number>
    readonly y: Conse<number>
    readonly w: Conse<number>
    readonly h: Conse<number>
    readonly color: Conse<string>

    constructor(x: number, y: number, w: number, h: number, color = 'black') {
        super()
        this.x = conse(x)
        this.y = conse(y)
        this.w = conse(w)
        this.h = conse(h)
        this.color = conse(color)
    }

    *portal(foton: Foton) {
        return {
            ...foton,
            color: yield* this.color,
        }
    }

    *whatsUp(ctx: Context /**, pixel?: Pixel */) {
        // if (pixel) {
        //     // восходящий поток
        //     return
        // }
        // если есть второй аргуметн - это восходящий поток (super.whatsUp(ctx, arg))
        // TODO
        // on up level
        // ctx.register(this.matrix) -
        //
        // on down level
        // matrix = ctx.query(Matrix) - get registered instance
        //
        // change Context to Tree
        // Matrix - constructor
        const matrix = ctx.get(MatrixQuery)!

        while (true) {
            const x = yield* this.x
            const y = yield* this.y
            const w = yield* this.w
            const h = yield* this.h

            yield yield* matrix.say(function* (this: Matrix) {
                // кто сказал say тот и this - т.е. this: Matrix
                // я в матрице :) сам беру что мне надо
                const set = new Set<Thread>()

                for (let _x = x; _x < x + w; _x++) {
                    for (let _y = y; _y < y + h; _y++) {
                        set.add(this.getThread(_y * w + _x))
                    }
                }

                return set
            })
        }
    }
}

const display = new Display(18, 8)
const rect = new Rect(1, 1, 1, 1, 'red')

display.eye.matrix.layers.insert(rect)

whatsUp(
    display,
    (r) => console.log(r),
    (e) => console.error(e)
)

/*
TODO

MUTOGEN

class CreateElement extends Mutator {
    mutate(){
        return document.createElement('div')
    }
}

class SetBackgroundColor extends Mutator {
    readonly color: string

    constructor(color: string){
        super()
        this.color = color
    }

    mutate(element: Element){ // after CreateElement
        element.style.backgroundColor = this.color
        return element
    }
}

const frl = fractal(function*(){
    yield new CreateElement()
    yield new SetBackgroundColor('red')
})

*/
// abstract class Shape {
//     abstract intersect(x: number, y: number): Generator<never, boolean>

//     readonly x: Conse<number>
//     readonly y: Conse<number>
//     readonly depth: Conse<number>
//     readonly color: Conse<string>

//     constructor(color = 'transparent') {
//         this.x = conse(0)
//         this.y = conse(0)
//         this.depth = conse(0)
//         this.color = conse(color)
//     }

//     move(ox: number, oy: number) {
//         const x = this.x.get() + ox
//         const y = this.y.get() + oy

//         this.moveTo(x, y)
//     }

//     moveTo(x: number, y: number) {
//         this.x.set(x)
//         this.y.set(y)
//     }
// }

// // class Rect extends Shape {
// //     readonly width: Conse<number>
// //     readonly height: Conse<number>

// //     constructor(width: number, height: number, color?: string) {
// //         super(color)

// //         this.width = conse(width)
// //         this.height = conse(height)
// //     }

// //     *intersect(x: number, y: number) {
// //         const ox = yield* this.x
// //         const oy = yield* this.y
// //         const w = yield* this.width
// //         const h = yield* this.height

// //         return ox < x && x <= ox + w && oy < y && y <= oy + h
// //     }
// // }

// type HTMLScreen = JSX.Element

// class Pixel extends Fractal<HTMLPixel> {
//     readonly x: number
//     readonly y: number

//     constructor(x: number, y: number) {
//         super()

//         this.x = x
//         this.y = y
//     }

//     *whatsUp(ctx: Context) {
//         const { x, y } = this
//         const shapes = ctx.get(Shapes)!
//         const pixelSize = ctx.get(PixelSize)!
//         const currentShape = cause(
//             function* () {
//                 let current: Shape | null = null
//                 let currDepth = Infinity

//                 for (const shape of yield* shapes) {
//                     if (yield* shape.intersect(x, y)) {
//                         const depth = yield* shape.depth

//                         if (depth < currDepth) {
//                             currDepth = depth
//                             current = shape
//                         }
//                     }
//                 }

//                 return current
//             },
//             { thisArg: this }
//         )
//         const color = cause(
//             function* () {
//                 while (true) {
//                     const currShape = yield* currentShape

//                     if (currShape) {
//                         yield yield* currShape.color
//                         continue
//                     }

//                     yield 'black'
//                 }
//             },
//             { thisArg: this }
//         )

//         while (true) {
//             const backgroundColor = yield* color
//             const width = yield* pixelSize
//             const height = width
//             const style = { backgroundColor, width, height }

//             yield <div className={styles.pixel} style={style} />
//         }
//     }

//     click() {
//         //console.log('Click', this)
//     }

//     mousemove() {
//         //console.log('Mousemove', this)
//     }

//     mouseenter() {
//         //console.log('mouseenter', this)
//     }
//     mouseleave() {
//         //console.log('mouseleave', this)
//     }
//     mousedown() {
//         //console.log('mousedown', this)
//     }
//     mouseup() {
//         //console.log('mouseup', this)
//     }
// }

// type HTMLPixel = JSX.Element

// const scene = new Scene(40, 25)

// render(scene)
// //
// declare var window: any

// const rect = new Rect(10, 6)

// rect.x.set(6)
// rect.y.set(11)
// rect.color.set('red')

// scene.add(rect)

// window.scene = scene
// window.rect = rect
