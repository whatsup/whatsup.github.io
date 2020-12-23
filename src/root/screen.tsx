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
        }
    }
}

const MatrixQuery = factor<Matrix>()

class Matrix extends Cause<Foton[]> {
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
            let foton = { color: 'black' } as Foton

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
                        // console.log('GET', x, y, w, h, _y * w + _x)
                        set.add(this.getThread(_y * this.width + _x))
                    }
                }

                console.log([...set])

                return set
            })
        }
    }
}

const display = new Display(15, 7)
const rect = new Rect(2, 2, 5, 3, 'red')

display.eye.matrix.layers.insert(rect)

declare var window: any

window.rect = rect

watch(
    display,
    (r) => console.log(r),
    (e) => console.error(e)
)
