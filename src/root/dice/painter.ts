import { DIRECTIONS, SCALE_X, SCALE_Y } from './constants'
import { AreaCellsData } from './generators/map'

//prettier-ignore
const POINTS = [
    [-0.5, -0.2],
    [   0, -0.5],
    [ 0.5, -0.2],
    [ 0.5,  0.2],
    [   0,  0.5],
    [-0.5,  0.2],
]

function isCoordsBelongsToArea(cells: AreaCellsData, x: number, y: number) {
    if (!(x in cells)) {
        return false
    }
    return cells[x].includes(y)
}

function createPoint(x: number, y: number, direction: number): string {
    const [ox, oy] = POINTS[direction]
    const px = (x + ox + (y % 2) * 0.5) * SCALE_X
    const py = (y * 0.7 + oy) * SCALE_Y

    return `${px},${py}`
}

function turn(direction: number, angle: number) {
    direction += angle
    direction %= 6

    if (direction < 0) {
        direction += 6
    }

    return direction
}

export function generateAreaShape(cells: AreaCellsData) {
    const points = [] as string[]

    let x = parseInt(Object.keys(cells)[0])
    let y = cells[x][0]
    let direction = 0
    let start = null as null | [number, number, number]

    do {
        const parity = y & 1
        const [ox, oy] = DIRECTIONS[parity][direction]
        const nextX = x + ox
        const nextY = y + oy

        if (isCoordsBelongsToArea(cells, nextX, nextY)) {
            x = nextX
            y = nextY

            if (points.length) {
                direction = turn(direction, -2)
            }
        } else {
            if (!points.length) {
                start = [x, y, direction]
            }

            const point = createPoint(x, y, direction)

            points.push(point)
            direction = turn(direction, 1)
        }
    } while (!start || x !== start[0] || y !== start[1] || direction !== start[2])

    return `M ${points.join(' ')} z`
}

function* iterateCellNeighborsCoords(x: number, y: number) {
    const parity = y & 1

    for (const [ox, oy] of DIRECTIONS[parity]) {
        yield [x + ox, y + oy]
    }
}

export function calculateAreaCenter(cells: AreaCellsData, log = false): [number, number] {
    let centerX = NaN
    let centerY = NaN
    let centerW = NaN

    for (const [key, value] of Object.entries(cells)) {
        const x = parseInt(key)

        for (const y of value) {
            const weight = calculateAreaCellWeight(cells, x, y)

            if (Number.isNaN(centerW) || centerW <= weight) {
                centerX = x
                centerY = y
                centerW = weight
            }

            if (log) {
                console.log(x, y, weight)
            }
        }
    }

    if (log) {
        console.log(centerX, centerY)
    }

    const x = (centerX + (centerY % 2) * 0.5) * SCALE_X
    const y = centerY * 0.7 * SCALE_Y

    return [x, y]
}

function calculateAreaCellWeight(
    cells: AreaCellsData,
    x: number,
    y: number,
    visited = new Map<number, Set<number>>(),
    depth = 1
) {
    let result = 1

    if (!visited.has(x)) {
        visited.set(x, new Set())
    }

    visited.get(x)!.add(y)

    for (const [nx, ny] of iterateCellNeighborsCoords(x, y)) {
        if (!isCoordsBelongsToArea(cells, nx, ny)) {
            continue
        }
        if (!visited.has(nx) || !visited.get(nx)!.has(ny)) {
            result += calculateAreaCellWeight(cells, nx, ny, visited, depth + 1) * depth
        }
    }

    return result
}
