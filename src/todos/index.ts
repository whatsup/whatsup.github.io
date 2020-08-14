import { fractal } from '@fract/core'
import { STORE_KEY } from './const'
import { MODE, Mode } from './factors'
import { AppData } from './app'

export const Todos = fractal(async function* _Todos() {
    const { newApp } = await import('./app')

    const data = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as AppData
    const App = newApp(data)

    yield* fractal(async function* _AutoSyncWithLocalStore() {
        yield* MODE(Mode.Data)

        while (true) {
            yield localStorage.setItem(STORE_KEY, JSON.stringify(yield* App))
        }
    })

    return App
})
