// class Cell {
//     readonly x: number
//     readonly y: number

//     constructor(x: number, y: number) {
//         this.x = x
//         this.y = y
//     }
// }

// class Area {
//     readonly world: World
//     readonly center: Cell

//     constructor(world: World, center: Cell) {
//         this.world = world
//         this.center = center
//     }
// }

// // function createWorld(size: number, areaW: number, areaH: number) {

// //     for(let col = 1; col < size; col++){
// //         for(let row = 1; row < size; row++){

// //             const x =

// //         }
// //     }

// // }

// class World {
//     private readonly cells: Cell[][]
//     private readonly areas: Area[]

//     constructor(size: number, areaW: number, areaH: number) {
//         this.areas = []
//         this.cells = []

//         for (let col = 0; col < size; col++) {
//             for (let row = 0; row < size; row++) {
//                 const x = col * areaW + Math.floor(Math.random() * areaW)
//                 const y = col * areaH + Math.floor(Math.random() * areaH)
//                 const center = new Cell(x, y)
//                 const area = new Area(this, center)

//                 this.addCell(center)
//                 this.areas.push(area)
//             }
//         }

//         // Array.from({ length: areaW * size }, (_, x) => {
//         //     return Array.from({ length: areaH * size }, (_, y) => {
//         //         const cell = new Cell(x, y)

//         //         return cell
//         //     })
//         // })
//     }

//     private addCell(cell: Cell) {
//         if (!this.cells[cell.x]) {
//             this.cells[cell.x] = []
//         }
//         this.cells[cell.x][cell.y] = cell
//     }

//     get(x: number, y: number) {
//         try {
//             return this.cells[x][y]
//         } catch (e) {
//             return null
//         }
//     }
// }
