import React from 'react'
import styled from 'styled-components'
import { fractal, fraction, exec, Fraction, Fractal } from '@fract/core'
import { ENTER_KEY, ESCAPE_KEY, FilterMode } from './const'
import { FILTER, MODE, Mode, CHANGE_FILTER } from './factors'
import { Todo, TodoData, TodoService } from './todo'
import { memo, connect } from './utils'

type AppGuts = {
    Filter: Fraction<FilterMode>
    Todos: Fraction<Todo[]>
}

export type App = Fractal<AppData | AppJsx>
export type AppData = { filter: FilterMode; todos: TodoData[] }
export type AppJsx = JSX.Element[]

export function newApp(data: AppData) {
    const init = memo(async () => {
        const { newTodo } = await import('./todo')
        const { filter = FilterMode.All, todos = [] } = data

        const Filter = fraction(filter)
        const Todos = fraction(todos.map((data) => newTodo(data)))

        return { Filter, Todos }
    })

    return fractal(async function* _App() {
        const guts = await init()

        switch (yield* MODE) {
            case Mode.Data:
                yield* workInDataMode(guts)
                break
            case Mode.Jsx:
                yield* workInJsxMode(guts)
                break
        }
    })
}

async function* workInDataMode({ Filter, Todos }: AppGuts) {
    while (true) {
        yield {
            filter: yield* Filter,
            todos: yield* connect(Todos),
        }
    }
}

async function* workInJsxMode({ Filter, Todos }: AppGuts) {
    const { newFooter } = await import('./footer')
    const { TODO_MODE, TodoMode, REMOVE_TODO } = await import('./todo')

    const create = (name: string) => {
        exec(async function* () {
            const { newTodo } = await import('./todo')
            const id = (~~(Math.random() * 1e8)).toString(16)
            const done = false
            const Todo = newTodo({ id, name, done })
            const todos = [Todo].concat(yield* Todos)

            Todos.use(todos)
        })
    }

    const removeCompleted = () => {
        exec(async function* () {
            yield* TODO_MODE(TodoMode.Service)

            const todos = [] as Todo[]

            for (const Todo of yield* Todos) {
                const { Done } = (yield* Todo) as TodoService

                if (!(yield* Done)) {
                    todos.push(Todo)
                }
            }

            Todos.use(todos)
        })
    }

    const removeTodo = (removeId: string) => {
        exec(async function* () {
            yield* TODO_MODE(TodoMode.Service)

            const todos = [] as Todo[]

            for (const Todo of yield* Todos) {
                const { id } = (yield* Todo) as TodoService

                if (id !== removeId) {
                    todos.push(Todo)
                }
            }

            Todos.use(todos)
        })
    }

    yield* FILTER(Filter)
    yield* CHANGE_FILTER((mode: FilterMode) => Filter.use(mode))
    yield* REMOVE_TODO(removeTodo)

    const Counters = fractal(async function* _Counters() {
        yield* TODO_MODE(TodoMode.Service)

        while (true) {
            let active = 0
            let completed = 0

            for (const Todo of yield* Todos) {
                const { Done } = (yield* Todo) as TodoService
                ;(yield* Done) ? completed++ : active++
            }

            yield { completed, active }
        }
    })

    const Filtered = fractal<Todo[]>(async function* _Filtered() {
        yield* TODO_MODE(TodoMode.Service)

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

    const Footer = newFooter(Counters, removeCompleted)
    const NewTodoName = fraction('')

    const handleNewTodoNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        NewTodoName.use(e.target.value)
    }
    const handleNewTodoNameInputKeyDown = ({ keyCode }: React.KeyboardEvent) =>
        exec(async function* () {
            const newTodoName = yield* NewTodoName

            if (newTodoName) {
                if (keyCode === ENTER_KEY) {
                    create(newTodoName)
                }
                if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
                    NewTodoName.use('')
                }
            }
        })

    while (true) {
        yield (
            <Container>
                <Wrapper>
                    <Header>todos</Header>
                    <Main>
                        <NewTodoNameInput
                            type="text"
                            value={yield* NewTodoName}
                            onChange={handleNewTodoNameInputChange}
                            onKeyDown={handleNewTodoNameInputKeyDown}
                            placeholder="What needs to be done?"
                        />
                        <List>{yield* connect(Filtered)}</List>
                    </Main>
                    {yield* Footer}
                </Wrapper>
            </Container>
        )
    }
}

const Container = styled.section`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 100px 20px;
    font-weight: 100;
`

const Wrapper = styled.section`
    width: 100%;
    max-width: 500px;
`

const Header = styled.header`
    font-size: 100px;
    text-align: center;
    color: #29b6f6;
    user-select: none;
`

const Main = styled.main`
    background-color: white;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
`

const List = styled.ul``

const NewTodoNameInput = styled.input`
    width: 100%;
    height: 70px;
    font-size: 24px;
    padding: 20px;
    margin: 0;
    border: none;
    outline: none;
    font-family: inherit;
    font-weight: inherit;
    border-bottom: 1px solid #e5e5e5;
    -webkit-font-smoothing: antialiased;
    ::placeholder {
        font-style: italic;
        color: #adadad;
    }
`
