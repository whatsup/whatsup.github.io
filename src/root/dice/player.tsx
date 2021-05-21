import { Fractal, Context, List, list } from 'whatsup'
import { PlayerData } from './generators'

export class Player extends Fractal<JSX.Element> {
    readonly id: number
    readonly color: string
    readonly areas: List<number>

    constructor({ id, areas }: PlayerData, color: string) {
        super()
        this.id = id
        this.color = color
        this.areas = list(areas)
    }

    *whatsUp(ctx: Context) {}
}
