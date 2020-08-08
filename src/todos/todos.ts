import { fractal, fraction, exec } from '@fract/core'
import { MODE, Mode } from './factors'
import { Todo, TodoData, TodoService } from './todo'

export async function newTodos(storeKey: string) {
    const { newTodo } = await import('./todo')

    const create = (name: string) => {
        exec(async function* () {
            const id = (~~(Math.random() * 1e8)).toString(16)
            const done = false
            const Todo = newTodo({ id, name, done }, remove)
            const todos = [Todo].concat(yield* Items)

            Items.use(todos)
        })
    }

    const remove = (removeId: string) => {
        exec(async function* () {
            yield* MODE(Mode.Service)

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

    const removeCompleted = () => {
        exec(async function* () {
            yield* MODE(Mode.Service)

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

    const Autosync = fractal(async function* _AutosyncWithLocalStore() {
        yield* MODE(Mode.Data)

        while (true) {
            const acc = [] as TodoData[]

            for (const Todo of yield* Items) {
                acc.push((yield* Todo) as TodoData)
            }

            yield localStorage.setItem(storeKey, JSON.stringify(acc))
        }
    })

    const items = JSON.parse(localStorage.getItem(storeKey) || '[]') as TodoData[]
    const Items = fraction(items.map((data) => newTodo(data, remove)))

    return {
        Todos: fractal(async function* _Items() {
            while (true) {
                yield yield* Items
            }
        }),
        Autosync,
        create,
        removeCompleted,
    }
}
