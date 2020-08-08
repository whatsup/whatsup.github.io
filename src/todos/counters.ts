import { Fractal, fractal } from '@fract/core'
import { Todo, TodoService } from './todo'
import { MODE, Mode } from './factors'

export type CountersData = { active: number; completed: number }

export function newCounters(Todos: Fractal<Todo[]>) {
    return fractal<CountersData>(async function* _Counters() {
        yield* MODE(Mode.Service)

        while (true) {
            let active = 0
            let completed = 0

            for (const Todo of yield* Todos) {
                const { Done } = (yield* Todo) as TodoService
                ;(yield* Done) ? completed++ : active++
            }

            yield { completed, active } as CountersData
        }
    })
}
