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
    Cause,
    Mutator,
} from 'whatsup'
import { Computed } from '@fract/core'

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

class EqualFotonFilter extends Mutator<Foton> {
    constructor(readonly foton: Foton) {
        super()
    }

    mutate(foton: Foton) {
        if (
            !foton ||
            foton.r !== this.foton.r ||
            foton.g !== this.foton.g ||
            foton.b !== this.foton.b ||
            foton.a !== this.foton.a
        ) {
            return this.foton
        }

        return foton
    }
}

function equalFoton<T extends Foton>(foton: T) {
    return new EqualFotonFilter(foton)
}

interface Foton {
    r: number
    g: number
    b: number
    a: number
}

const PIXEL_SIZE = 10

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
        element.style.setProperty('width', `${this.width * PIXEL_SIZE}px`)
        element.style.setProperty('height', `${this.height * PIXEL_SIZE}px`)

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
    readonly color: string

    constructor(foton: Foton) {
        super()

        let color = '#'

        for (const channel of 'rgba') {
            const value = foton[channel as keyof Foton]

            if (value < 16) {
                color += '0'
            }

            color += value.toString(16)
        }

        this.color = color
    }

    mutate(element: HTMLDivElement | undefined) {
        if (!element) {
            element = document.createElement('div')
            element.style.setProperty('background-color', 'currentColor')
            element.style.setProperty('width', `${PIXEL_SIZE}px`)
            element.style.setProperty('height', `${PIXEL_SIZE}px`)
            element.style.setProperty('display', 'inline-block')
        }
        if (element.style.color !== this.color) {
            element.style.color = this.color
        }
        return element
    }
}

class Eye extends Fractal<HTMLDivElement[]> {
    readonly matrix: Matrix
    readonly retina: Cause<HTMLPixelMutator>[]

    constructor(length: number, width: number) {
        super()

        const matrix = new Matrix(width, length / width)

        this.matrix = matrix
        this.retina = Array.from({ length }, (_, i) =>
            cause(function* () {
                while (true) {
                    yield new HTMLPixelMutator(yield* matrix.threads[i])
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
        }
    }
}

class Matrix {
    readonly layers = list<Layer>([])
    readonly threads: Thread[] = []

    readonly width: number
    readonly height: number

    constructor(w: number, h: number) {
        this.width = w
        this.height = h
        this.threads = Array.from({ length: w * h }, () => new Thread(this))
    }

    *say(generator: (this: this) => Generator<any>) {
        return yield* generator.call(this)
    }

    // getThread(index: number) {
    //     const { threads } = this

    //     if (index >= threads.length) {
    //         throw `Invalid thread index ${index}`
    //     }

    //     return this.threads[index]
    // }

    // *whatsUp(ctx: Context) {
    //     ctx.set(MatrixQuery, this)

    //     while (true) {
    //         const fotons = [] as Foton[]

    //         for (const thread of this.threads) {
    //             fotons.push(yield* thread)
    //         }

    //         yield fotons
    //     }
    // }
}

class Thread extends Cause<Foton> {
    readonly matrix: Matrix

    constructor(matrix: Matrix) {
        super()
        this.matrix = matrix
    }

    readonly layers = cause<Layer[]>(
        function* (this: Thread) {
            const thread = this

            while (true) {
                yield equalArr(
                    yield* this.matrix.say(function* (this: Matrix) {
                        const layers = [] as Layer[][]

                        /*
                        в матрице каждый сам берет себе все что ему нужно
                        и только для частых или защищенных запросов
                        в узле реализуются новые методы
                        */

                        for (const layer of yield* this.layers) {
                            if ((yield* layer).has(thread)) {
                                const depth = yield* layer.depth

                                if (!layers[depth]) {
                                    layers[depth] = [] as Layer[]
                                }

                                layers[depth].push(layer)
                            }
                        }

                        return layers.flat()
                    })
                )
            }
        },
        { thisArg: this }
    );

    *whatsUp(ctx: Context) {
        // возвращает себя тлько через фильтры

        while (true) {
            let foton = {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            } as Foton

            for (const layer of yield* this.layers) {
                foton = yield* layer.portal(foton)

                if (foton.a >= 255) {
                    break
                }
            }

            yield equalFoton(foton)
        }
    }
}

abstract class Layer extends Cause<Set<Thread>> {
    abstract portal(foton: Foton): Generator<never, Foton>

    readonly depth = conse(0)
}

function channel(color: string, group: number) {
    return parseInt('0x' + color.slice(group * 2, group * 2 + 2))
}

class Filter {}

class Rect extends Layer {
    matrix!: Matrix
    readonly x: Conse<number>
    readonly y: Conse<number>
    readonly w: Conse<number>
    readonly h: Conse<number>
    readonly color = conse('00000000')

    constructor(x: number, y: number, w: number, h: number) {
        super()
        this.x = conse(x)
        this.y = conse(y)
        this.w = conse(w)
        this.h = conse(h)
    }

    setMatrix(matrix: Matrix) {
        this.matrix = matrix
    }

    *portal({ r, g, b, a }: Foton) {
        const color = yield* this.color

        r += channel(color, 0)
        g += channel(color, 1)
        b += channel(color, 2)
        a += channel(color, 3)

        if (r > 255) r = 255
        if (g > 255) g = 255
        if (b > 255) b = 255
        if (a > 255) a = 255

        return { r, g, b, a }
    }

    *whatsUp(ctx: Context /**, pixel?: Pixel */) {
        //const matrix = ctx.get(MatrixQuery)!

        while (true) {
            const x = yield* this.x
            const y = yield* this.y
            const w = yield* this.w
            const h = yield* this.h

            yield yield* this.matrix.say(function* (this: Matrix) {
                // кто сказал say тот и this - т.е. this: Matrix
                // я в матрице :) сам беру что мне надо
                const set = new Set<Thread>()

                for (let _x = x; _x < x + w; _x++) {
                    for (let _y = y; _y < y + h; _y++) {
                        // console.log('GET', x, y, w, h, _y * w + _x)
                        set.add(this.threads[_y * this.width + _x])
                    }
                }

                return set
            })
        }
    }
}

const display = new Display(40, 30)
const rect1 = new Rect(2, 2, 15, 10)
const rect2 = new Rect(10, 10, 15, 10)
const rect3 = new Rect(5, 5, 15, 10)

rect1.color.set('0000ff50')
rect2.color.set('ff0000ff')
rect3.color.set('00ff0050')

const delay = (t: number) => new Promise((r) => setTimeout(r, t))

async function move() {
    for (let i = 0; i < 10; i++) {
        rect1.x.set(rect1.x.get() + 1)
        await delay(10)
    }
}

rect1.setMatrix(display.eye.matrix)
rect2.setMatrix(display.eye.matrix)
rect3.setMatrix(display.eye.matrix)

display.eye.matrix.layers.insert(rect1)
display.eye.matrix.layers.insert(rect2)
display.eye.matrix.layers.insert(rect3)

declare var window: any

window.rect1 = rect1
window.rect2 = rect2
window.move = move

watch(
    display,
    (r) => console.log(r),
    (e) => console.error(e)
)
