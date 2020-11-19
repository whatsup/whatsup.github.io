import { fractal, Fractal } from '@fract/core'
import { STORE_KEY } from './const'
import { MODE, Mode } from './factors'
import { AppData, App } from './app/app'

export class Antistress extends Fractal<JSX.Element> {
    readonly appJsx: Fractal<JSX.Element>
    readonly appData: Fractal<AppData>

    constructor() {
        super()
        const data = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as AppData
        const app = new App(data)

        this.appData = fractal(async function* (ctx) {
            ctx.set(MODE, Mode.Data)
            return app
        })

        this.appJsx = fractal(async function* (ctx) {
            ctx.set(MODE, Mode.Jsx)
            return app
        })
    }

    async *collector() {
        while (true) {
            const data = yield* this.appData

            localStorage.setItem(STORE_KEY, JSON.stringify(data))

            yield yield* this.appJsx
        }
    }
}
