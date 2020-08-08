import { fractal, Fractal } from '@fract/core'
import { Todo, TodoService } from './todo'
import { MODE, Mode, FILTER } from './factors'
import { FilterMode } from './const'

export function newFiltered(Todos: Fractal<Todo[]>) {
    return fractal<Todo[]>(async function* _Filtered() {
        yield* MODE(Mode.Service)

        while (true) {
            const filter = yield* yield* FILTER
            const acc = [] as Todo[]

            for (const Todo of yield* Todos) {
                const { Done } = (yield* Todo) as TodoService
                const done = yield* Done

                if (
                    filter === FilterMode.All ||
                    (filter === FilterMode.Active && !done) ||
                    (filter === FilterMode.Completed && done)
                ) {
                    acc.push(Todo)
                }
            }

            yield acc
        }
    })
}
