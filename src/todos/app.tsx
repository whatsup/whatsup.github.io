import React from 'react'
import styled from 'styled-components'
import { fractal, fraction, exec, Fraction, Fractal } from '@fract/core'
import { ENTER_KEY, ESCAPE_KEY, FilterMode } from './const'
import { FILTER, MODE, Mode, CHANGE_FILTER } from './factors'
import { TodosData } from './todos'
import { memo } from './utils'

type AppGuts = {
    Filter: Fraction<FilterMode>
    Todos: Fractal<any>
}

export type App = Fractal<AppData | AppJsx>
export type AppData = { filter: FilterMode; todos: TodosData }
export type AppJsx = JSX.Element[]

export function newApp(data: AppData) {
    const init = memo(async () => {
        const { newTodos } = await import('./todos')
        const { filter = FilterMode.All, todos = [] } = data

        const Filter = fraction(filter)
        const Todos = newTodos(todos)

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
            todos: yield* Todos,
        }
    }
}

async function* workInJsxMode({ Filter, Todos }: AppGuts) {
    const { newFooter } = await import('./footer')
    const { TODOS_MODE, TodosMode } = await import('./todos')

    yield* FILTER(Filter)
    yield* CHANGE_FILTER((mode: FilterMode) => Filter.use(mode))

    const Counters = fractal(async function* _Counters() {
        yield* TODOS_MODE(TodosMode.Counters)
        return Todos
    })
    const { create, removeCompleted } = yield* fractal(async function* _Counters() {
        yield* TODOS_MODE(TodosMode.Actions)
        return Todos
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
                        <List>{yield* Todos}</List>
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
