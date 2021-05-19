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

class Path {
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

    jump(x: number, y: number) {
        this.x = x
        this.y = y
    }

    move(x: number, y: number) {
        this.x = x
        this.y = y
    }

    addPoint() {
        const [ox, oy] = POINTS[this.direction]
        const parity = this.y & 1
        const tx = parity ? 0.5 : 0
        //const ty = -0.3
        const x = this.x + ox + tx
        const y = this.y * 0.7 + oy //+ ty

        if (this.points.some((p) => p[0] === x && p[1] === y)) {
            debugger
        }

        this.points.push([x, y])
    }

    *draw() {
        let start = null as null | [number, number, number]
        let i = 0

        do {
            const parity = this.y & 1
            const [ox, oy] = DIRECTIONS[parity][this.direction]
            const oldX = this.x
            const oldY = this.y
            const oldDirection = this.direction

            const x = this.x + ox
            const y = this.y + oy

            yield [x, y]

            if (this.points.length === 1) {
                start = [oldX, oldY, oldDirection]
            }

            if (i++ > 50) {
                console.log('breaked')
                break
            }
        } while (!start || this.x !== start[0] || this.y !== start[1] || this.direction !== start[2])
    }

    rotateRight() {
        this.direction = this.direction === 5 ? 0 : this.direction + 1
    }

    rotateLeft() {
        this.direction = this.direction === 0 ? 5 : this.direction - 1
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
    const path = new Path(startX, startY)

    for (const [x, y] of path.draw()) {
        const neighbor = getCellArea(map, x, y)

        if (neighbor === areaId) {
            path.move(x, y)

            if (path.points.length) {
                path.rotateLeft()
                path.rotateLeft()
            }
        } else {
            path.addPoint()
            path.rotateRight()
        }
    }

    return path.points
}
