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
    Event,
    Cause,
    Mutator,
    whatsUp,
} from 'whatsup'
import { HTMLPixel, div } from './jsx'

//class Alive extends Conse<boolean> {}

// class Entity extends Conse<any> {
//     readonly alive = new Alive(true);

//     *whatsUp() {
//         return
//     }
// }

class Thread extends Cause<any> {
    readonly navigator: Navigator
    readonly color: Conse<string>

    constructor(navigator: Navigator) {
        super()
        this.navigator = navigator
        this.color = conse('white')
    }

    invertColor() {
        this.color.set(this.color.get() === 'black' ? 'white' : 'black')
    }

    *whatsUp() {
        const top = this.navigator.top()
        const left = this.navigator.left()
        const right = this.navigator.right()
        const bottom = this.navigator.bottom()
        const topLeft = this.navigator.topLeft()
        const topRight = this.navigator.topRight()
        const bottomLeft = this.navigator.bottomLeft()
        const bottomRight = this.navigator.bottomRight()

        while (true) {
            const color = yield* this.color
            const t = top ? yield* top.color : undefined
            const l = left ? yield* left.color : undefined
            const r = right ? yield* right.color : undefined
            const b = bottom ? yield* bottom.color : undefined
            const tl = topLeft ? yield* topLeft.color : undefined
            const tb = topRight ? yield* topRight.color : undefined
            const bl = bottomLeft ? yield* bottomLeft.color : undefined
            const br = bottomRight ? yield* bottomRight.color : undefined
            const colors = [t, l, r, b, tl, tb, bl, br]

            const blackCount = colors.filter((c) => c === 'black').length

            if (color === 'white' && blackCount === 3) {
                yield this
                continue
            }
            if (color === 'black' && (blackCount < 2 || blackCount > 3)) {
                yield this
                continue
            }

            yield null
        }
    }
}

class Navigator {
    readonly id: number
    readonly width: number
    readonly lines: number
    readonly threads: Thread[]

    constructor(id: number, width: number, lines: number, threads: Thread[]) {
        //super()
        this.id = id
        this.width = width
        this.lines = lines
        this.threads = threads
    }

    top() {
        return this.threads[this.id - this.width]
    }

    left() {
        return this.threads[this.id - 1]
    }

    right() {
        return this.threads[this.id + 1]
    }

    bottom() {
        return this.threads[this.id + this.width]
    }

    topLeft() {
        return this.threads[this.id - this.width - 1]
    }

    topRight() {
        return this.threads[this.id - this.width + 1]
    }

    bottomLeft() {
        return this.threads[this.id + this.width - 1]
    }

    bottomRight() {
        return this.threads[this.id + this.width + 1]
    }
}

class Pixel extends Cause<HTMLElement> {
    readonly thread: Thread

    constructor(thread: Thread) {
        super()
        this.thread = thread
    }

    *whatsUp() {
        const evClick = (e: any) => {
            console.log(e)
            this.thread.invertColor()
        }

        while (true) {
            yield HTMLPixel({
                color: yield* this.thread.color,
                evClick,
            })
        }
    }
}

class Matrix extends Cause<any> {
    readonly width: number
    readonly lines: number
    readonly threads: Thread[]
    readonly pixels: Pixel[]

    constructor(width: number, lines: number) {
        super()
        this.width = width
        this.lines = lines
        this.threads = [] as Thread[]

        for (let i = 0; i < width * lines; i++) {
            const nav = new Navigator(i, width, lines, this.threads)
            const thread = new Thread(nav)
            this.threads.push(thread)
        }

        this.pixels = this.threads.map((thread) => new Pixel(thread))
    }

    readonly updateReady = cause(
        function* (this: Matrix) {
            while (true) {
                const threads = [] as Thread[]

                for (const thread of this.threads) {
                    const result = yield* thread

                    if (result) {
                        threads.push(result)
                    }
                }

                yield equalArr(threads)
            }
        },
        { thisArg: this }
    );

    *whatsUp() {
        //const prev = [] as string[]

        while (true) {
            // const tasks = [] as (() => void)[]

            // let i = 0

            // for (const thread of this.threads) {
            //     const color = yield* thread

            //     if (i >= prev.length || prev[i] !== color) {
            //         tasks.push(() => thread.color.set(color))
            //     }
            // }

            const elements = [] as HTMLElement[]

            for (const pixel of this.pixels) {
                const element = yield* pixel
                elements.push(element)
            }

            yield equalArr(elements)
        }
    }
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

class Display extends Cause<HTMLElement> {
    readonly width: number
    readonly height: number
    readonly matrix: Matrix

    constructor(w: number, h: number) {
        super()
        this.width = w
        this.height = h
        this.matrix = new Matrix(w, h)
    }

    *whatsUp() {
        const element = div()

        document.getElementById('app')!.append(element)

        while (true) {
            const pixels = yield* this.matrix

            console.log(element, pixels)
            element.style.width = (this.width * 20).toString() + 'px'
            element.style.height = (this.height * 20).toString() + 'px'
            element.style.fontSize = '0'

            element.innerHTML = ''
            element.append(...pixels)

            yield element
        }
    }
}

const display = new Display(2, 2)

whatsUp(display.matrix.updateReady, (threads: Thread[]) => {
    transaction(() => {
        for (const thread of threads) {
            thread.invertColor()
        }
    })
})

whatsUp(
    new Display(2, 2),
    (d) => console.log(d),
    (e) => console.error(e)
)
