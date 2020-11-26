import { Computed } from '@fract/core'
import { STORE_KEY } from './const'
import { AppData } from './app/app'
import { App } from './app/app'

export class Todos extends Computed<any> {
    readonly app: App

    constructor() {
        super()
        const data = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as AppData
        this.app = new App(data)
    }

    *stream() {
        while (true) {
            const data = yield* this.app.data

            localStorage.setItem(STORE_KEY, JSON.stringify(data))

            yield yield* this.app
        }
    }
}
