import { Fractal, Fraction, Cause, Conse, List as Reasons, Mutator, StreamGenerator, conse, Context } from 'whatsup'

interface Screen {}

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

function uniqArr<T>(arr: T[]) {
    return new EqualArrFilter(arr)
}

interface Position {
    x: Conse<number>
    y: Conse<number>
    z: Conse<number>
}

interface Coods {
    x: number
    y: number
    z: number
}

class Position extends Cause<Coods> {
    x: Conse<number>
    y: Conse<number>
    z: Conse<number>

    constructor(x: number, y: number, z: number) {
        super()
        this.x = conse(x)
        this.y = conse(y)
        this.z = conse(z)
    }

    *whatsUp() {
        while (true) {
            yield {
                x: yield* this.x,
                y: yield* this.y,
                z: yield* this.z,
            }
        }
    }
}

interface Color {
    r: Conse<number>
    g: Conse<number>
    b: Conse<number>
    a: Conse<number>
}

interface Mesh {}

interface Shape {
    readonly mesh: Mesh
    readonly position: Position
}

// interface Thread<T = any> extends Fractal<T> {
//     whatsUp(ctx: Context): StreamGenerator<T | Fractal<T>>
// }

class ThreadShapes extends Fractal<Shape[]> {
    *whatsUp(ctx: Ctx) {
        const matrix = ctx.find(Matrix)
        const thread = ctx.find(Thread)
        const shapes = [] as Shape[]

        for (const shape of yield* matrix.shapes) {
            const position = matrix.getPosition(shape)

            const x = yield* position.x
            const y = yield* position.y

            if (x === thread.x && y === thread.y) {
                shapes.push(shape)
            }
        }

        return shapes
    }
}

class ThreadMutatorFactory {
    create<T>(data: T) {
        return new ThreadMutator(data)
    }
}

class ThreadMutator extends Mutator<any> {
    constructor(data: any) {
        super()
    }

    mutate() {}
}

class Thread<T = any> extends Fractal<T> {
    readonly x: number
    readonly y: number
    readonly shapes: ThreadShapes

    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
        this.shapes = new ThreadShapes()
    }

    *whatsUp(ctx: Ctx) {
        ctx.share(this)

        const mutatorFactory = ctx.find(ThreadMutatorFactory)

        while (true) {
            for (const shape of yield* this.shapes) {
                yield mutatorFactory.create()
            }
        }
    }
}

interface Ctx extends Context {
    find<T>(ctor: new (...args: any[]) => T): T
    share<T>(instance: T): void
}

class MatrixShapes extends Reasons<Shape> {}

class MatrixThreads extends Reasons<Thread> {}

class Matrix extends Fractal<any> {
    readonly threads: MatrixThreads
    readonly shapes: MatrixShapes
    readonly positions: WeakMap<Shape, Position>

    constructor(threads: Thread[]) {
        super()
        this.threads = new MatrixThreads(threads)
        this.shapes = new MatrixShapes([])
        this.positions = new WeakMap()
    }

    place(shape: Shape, { x, y, z }: Coods) {
        this.shapes.insert(shape)
        this.positions.set(shape, new Position(x, y, z))
    }

    delete(shape: Shape) {
        this.shapes.delete(shape)
        this.positions.delete(shape)
    }

    getPosition(shape: Shape) {
        return this.positions.get(shape)!
    }

    *whatsUp() {
        while (true) {
            const results = [] as any[]

            for (const thread of yield* this.threads) {
                results.push(yield* thread)
            }

            yield uniqArr(results)
        }
    }
}

class Matrix {}
