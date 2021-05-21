/* Path */

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

//prettier-ignore
const POINTS = [
    [-0.5, -0.2],
    [   0, -0.5],
    [ 0.5, -0.2],
    [ 0.5,  0.2],
    [   0,  0.5],
    [-0.5,  0.2],
]

type CellAreaMap = {
    [k: number]: {
        [k: number]: number
    }
}

function getCellArea(map: CellAreaMap, x: number, y: number) {
    if (x in map && y in map[x]) {
        return map[x][y]
    }

    return null
}

class AreaTracer {
    readonly points: [number, number][]

    private x: number
    private y: number
    private direction: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.points = []
        this.direction = 0
    }

    move(x: number, y: number) {
        this.x = x
        this.y = y
    }

    addPoint() {
        const [ox, oy] = POINTS[this.direction]
        const parity = this.y & 1
        const tx = parity ? 0.5 : 0
        const x = this.x + ox + tx
        const y = this.y * 0.7 + oy

        this.points.push([x, y])
    }

    *go() {
        let start = null as null | [number, number, number]

        do {
            const { x, y, direction } = this
            const parity = y & 1
            const [ox, oy] = DIRECTIONS[parity][direction]

            yield [x + ox, y + oy]

            if (this.points.length === 1) {
                start = [x, y, direction]
            }
        } while (!start || this.x !== start[0] || this.y !== start[1] || this.direction !== start[2])
    }

    turn(offset: number) {
        this.direction += offset
        this.direction %= 6

        if (this.direction < 0) {
            this.direction += 6
        }
    }
}

function* iterateCells(map: CellAreaMap) {
    for (const [x, submap] of Object.entries(map)) {
        for (const [y, areaId] of Object.entries(submap)) {
            yield [parseInt(x), parseInt(y), areaId]
        }
    }
}

type Area = {
    id: number
    shape: [number, number][]
}

export function generateAreas(map: CellAreaMap) {
    const completed = new Map<number, Area>()

    for (const [x, y, id] of iterateCells(map)) {
        if (completed.has(id)) {
            continue
        }

        const shape = generateAreaShape(map, x, y)
        const area = { id, shape }

        completed.set(id, area)
    }

    return [...completed.values()]
}

function generateAreaShape(map: CellAreaMap, startX: number, startY: number) {
    const areaId = getCellArea(map, startX, startY)
    const tracer = new AreaTracer(startX, startY)
    const neighbors = [] as number[]
    const perimeter = [] as [number, number][]

    for (const [x, y] of tracer.go()) {
        const neighbor = getCellArea(map, x, y)

        if (neighbor === areaId) {
            tracer.move(x, y)

            if (tracer.points.length) {
                tracer.turn(-2)
            }
        } else {
            if (neighbor) {
                neighbors.push(neighbor)
            }

            //perimeter.push([x, y])
            tracer.addPoint()
            tracer.turn(1)
        }
    }

    //const shape = createAreaShape(perimeter)

    return tracer.points
}

// function createAreaShape(perimeter: [number, number][]) {
//     return perimeter.map(([x, y]) => {
//         const [ox, oy] = POINTS[this.direction]
//         const parity = this.y & 1
//         const tx = parity ? 0.5 : 0
//         const x = this.x + ox + tx
//         const y = this.y * 0.7 + oy
//     })
// }
