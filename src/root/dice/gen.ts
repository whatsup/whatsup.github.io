import { BOUNDS_MIN_X, BOUNDS_MAX_X, BOUNDS_MIN_Y, BOUNDS_MAX_Y } from './constants'

const DIRECTIONS = [
    [
        [-1, -1],
        [+0, -1],
        [+1, +0],
        [+0, +1],
        [-1, +1],
        [-1, +0],
    ],
    [
        [+0, -1],
        [+1, -1],
        [+1, +0],
        [+1, +1],
        [+0, +1],
        [-1, +0],
    ],
]

function checkBounds(x: number, y: number) {
    return BOUNDS_MIN_X <= x && x <= BOUNDS_MAX_X && BOUNDS_MIN_Y <= y && y <= BOUNDS_MAX_Y
}

class Cell {
    readonly x: number
    readonly y: number
    readonly world: World

    private freeNeighborsCount: number

    constructor(world: World, x: number, y: number) {
        this.x = x
        this.y = y
        this.world = world
        this.freeNeighborsCount = 0

        for (const [x, y] of this.neighbors()) {
            const neighbor = world.getCell(x, y)

            if (neighbor) {
                neighbor.decrementFreeNeighborsCount()
            } else {
                this.freeNeighborsCount++
            }
        }
    }

    decrementFreeNeighborsCount() {
        this.freeNeighborsCount--
    }

    hasFreeNeighbors() {
        return this.freeNeighborsCount > 0
    }

    getFreeNeighborsCount() {
        return this.freeNeighborsCount
    }

    getFreeNeighborsCoords() {
        const result = [] as [number, number][]

        for (const [x, y] of this.neighbors()) {
            if (!this.world.getCell(x, y)) {
                result.push([x, y])
            }
        }

        return result
    }

    get freeNeighborsCoords() {
        return this.getFreeNeighborsCoords()
    }

    *neighbors() {
        const parity = this.y & 1

        for (const [ox, oy] of DIRECTIONS[parity]) {
            yield [this.x + ox, this.y + oy]
        }
    }
}

class World {
    readonly size: number
    readonly areas: Area[]
    readonly cells: { [k: number]: { [k: number]: Cell } }

    constructor(size: number /* Areas */) {
        this.size = size
        this.areas = []
        this.cells = {}
    }

    createCell(x: number, y: number) {
        if (!this.cells[x]) {
            this.cells[x] = {}
        }

        return (this.cells[x][y] = new Cell(this, x, y))
    }

    // createArea(size: number) {
    //     const area = new Area(this, size)

    //     this.areas.push(area)

    //     return area
    // }

    getCell(x: number, y: number) {
        if (x in this.cells && y in this.cells[x]) {
            return this.cells[x][y]
        }

        return null
    }

    *iterateCells() {
        for (const nest of Object.values(this.cells)) {
            for (const cell of Object.values(nest)) {
                yield cell
            }
        }
    }

    getPerimeter() {
        const result = [] as Cell[]

        for (const cell of this.iterateCells()) {
            if (cell.hasFreeNeighbors()) {
                result.push(cell)
            }
        }

        return result
    }

    expand() {
        while (this.areas.length < this.size) {
            const size = getRandomNumberFromRange(7, 15)
            const area = new Area(this, size)
            const perimeter = this.getPerimeter()

            if (perimeter.length === 0) {
                const center = this.createCell(0, 0)

                area.addCell(center)
            } else {
                const from = getCandidateFromPerimeter(perimeter)
                const freeNeighborsCoords = from.getFreeNeighborsCoords()
                const [x, y] = getRandomItemFromArray(freeNeighborsCoords)
                const candidate = this.createCell(x, y)

                area.addCell(candidate)
            }

            try {
                area.expand()
            } catch (e) {
                continue
            }

            this.areas.push(area)
        }
    }

    pack() {
        const acc = {} as { [k: number]: { [k: number]: number } }

        for (const area of this.areas) {
            for (const cell of area.cells) {
                if (acc[cell.x] === undefined) {
                    acc[cell.x] = {}
                }

                acc[cell.x][cell.y] = area.id
            }
        }

        // for (const cell of this.iterateCells()) {
        //     if (acc[cell.x] === undefined) {
        //         acc[cell.x] = {}
        //     }

        //     acc[cell.x][cell.y] = cell.getArea().id
        // }

        return acc
    }
}

function getRandomNumberFromRange(start: number, end: number) {
    return start + Math.round(Math.random() * (end - start))
}

function getRandomItemFromArray<T>(array: T[]) {
    const index = getRandomNumberFromRange(0, array.length - 1)

    return array[index]
}

let AREA_ID = 1

class Area {
    readonly id = AREA_ID++
    readonly world: World
    readonly size: number
    readonly cells: Cell[]

    constructor(world: World, size: number /* Cells */) {
        this.world = world
        this.size = size
        this.cells = []
    }

    get filled() {
        return this.cells.length === this.size
    }

    getPerimeter() {
        return this.cells.filter((cell) => cell.hasFreeNeighbors())
    }

    addCell(cell: Cell) {
        this.cells.push(cell)
    }

    expand() {
        while (this.cells.length < this.size) {
            const perimeter = this.getPerimeter()
            const from = getCandidateFromPerimeter(perimeter)
            const freeNeighborsCoords = from.getFreeNeighborsCoords()
            const [x, y] = getRandomItemFromArray(freeNeighborsCoords)
            const candidate = this.world.createCell(x, y)

            this.addCell(candidate)
        }
    }
}

function calculateCandidateWeight(candidate: Cell) {
    return (6 - candidate.getFreeNeighborsCount()) ** 7
}

function getCandidateFromPerimeter(perimeter: Cell[]) {
    const max = perimeter.reduce((acc, cell) => acc + calculateCandidateWeight(cell), 0)
    const rnd = getRandomNumberFromRange(0, max)

    let offset = 0

    for (const cell of perimeter) {
        offset += calculateCandidateWeight(cell)

        if (offset >= rnd) {
            return cell
        }
    }

    throw 'error search perimeter candidate'
}

export function generateMap() {
    const world = new World(24)

    world.expand()

    return world.pack()
}
