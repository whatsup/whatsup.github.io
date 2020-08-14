import { fractal, fraction, exec, Fraction, factor, Fractal } from '@fract/core'
import { MODE, Mode, FILTER } from './factors'
import { Todo, TodoData, TodoService } from './todo'
import { memo, connect } from './utils'
import { FilterMode } from './const'

type Guts = {
    Items: Fraction<Todo[]>
}

export type Todos = Fractal<TodosData | TodosJsx | TodosCounters>
export type TodosData = TodoData[]
export type TodosJsx = JSX.Element[]
export type TodosCounters = { active: number; completed: number }

export enum TodosMode {
    Actions,
    Counters,
}

export const TODOS_MODE = factor<TodosMode>()

export function newTodos(data: TodoData[]): Todos {
    const init = memo(async () => {
        const { newTodo } = await import('./todo')
        const Items = fraction(data.map((data) => newTodo(data)))

        return { Items }
    })

    return fractal(async function* _Todos() {
        const guts = await init()

        switch (yield* TODOS_MODE) {
            case TodosMode.Actions:
                yield* workInActionsMode(guts)
                break
            case TodosMode.Counters:
                yield* workInCountersMode(guts)
                break
            default:
                switch (yield* MODE) {
                    case Mode.Data:
                        yield* workInDataMode(guts)
                        break
                    case Mode.Jsx:
                        yield* workInJsxMode(guts)
                        break
                }
        }
    })
}

async function* workInDataMode({ Items }: Guts) {
    while (true) {
        yield yield* connect(Items)
    }
}

async function* workInJsxMode({ Items }: Guts) {
    const { TODO_MODE, TodoMode, REMOVE_TODO } = await import('./todo')

    const removeTodo = (removeId: string) => {
        exec(async function* () {
            yield* TODO_MODE(TodoMode.Service)

            const todos = [] as Todo[]

            for (const Todo of yield* Items) {
                const { id } = (yield* Todo) as TodoService

                if (id !== removeId) {
                    todos.push(Todo)
                }
            }

            Items.use(todos)
        })
    }

    yield* REMOVE_TODO(removeTodo)

    const Filtered = fractal<Todo[]>(async function* _Filtered() {
        yield* TODO_MODE(TodoMode.Service)

        while (true) {
            const filter = yield* yield* FILTER
            const acc = [] as Todo[]

            for (const Todo of yield* Items) {
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

    while (true) {
        yield yield* connect(Filtered)
    }
}

async function* workInActionsMode({ Items }: Guts) {
    const { TODO_MODE, TodoMode } = await import('./todo')

    const create = (name: string) => {
        exec(async function* () {
            const { newTodo } = await import('./todo')
            const id = (~~(Math.random() * 1e8)).toString(16)
            const done = false
            const Todo = newTodo({ id, name, done })
            const todos = [Todo].concat(yield* Items)

            Items.use(todos)
        })
    }

    const removeCompleted = () => {
        exec(async function* () {
            yield* TODO_MODE(TodoMode.Service)

            const todos = [] as Todo[]

            for (const Todo of yield* Items) {
                const { Done } = (yield* Todo) as TodoService

                if (!(yield* Done)) {
                    todos.push(Todo)
                }
            }

            Items.use(todos)
        })
    }

    while (true) {
        yield { create, removeCompleted }
    }
}

async function* workInCountersMode({ Items }: Guts) {
    const { TODO_MODE, TodoMode } = await import('./todo')
    yield* TODO_MODE(TodoMode.Service)

    while (true) {
        let active = 0
        let completed = 0

        for (const Todo of yield* Items) {
            const { Done } = (yield* Todo) as TodoService
            ;(yield* Done) ? completed++ : active++
        }

        yield { completed, active } as TodosCounters
    }
}
