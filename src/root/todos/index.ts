import { fractal, Fractal } from '@fract/core'
import { STORE_KEY } from './const'
import { MODE, Mode } from './factors'
import { AppData } from './app/app'
import { App } from './app/app'

export class Todos extends Fractal<any> {
    readonly appJsx: Fractal<JSX.Element>
    readonly appData: Fractal<AppData>

    constructor() {
        super()
        const data = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as AppData
        const app = new App(data)

        this.appData = fractal(function* (ctx) {
            ctx.set(MODE, Mode.Data)
            return app
        })

        this.appJsx = fractal(function* (ctx) {
            ctx.set(MODE, Mode.Jsx)
            return app
        })
    }

    *stream() {
        while (true) {
            const data = yield* this.appData

            localStorage.setItem(STORE_KEY, JSON.stringify(data))

            yield yield* this.appJsx
        }
    }
}
