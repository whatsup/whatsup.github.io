import React from 'react'
import styled from 'styled-components'
import { fractal, fraction, exec } from '@fract/core'
import { STORE_KEY, ENTER_KEY, ESCAPE_KEY, FilterMode } from './const'
import { FILTER, CHANGE_FILTER } from './factors'
import { TodoJsx } from './todo'

export const App = fractal<JSX.Element>(async function* _App() {
    const { newTodos } = await import('./todos')
    const { newFiltered } = await import('./filtered')
    const { newCounters } = await import('./counters')
    const { newFooter } = await import('./footer')

    const { Todos, Autosync, create, removeCompleted } = await newTodos(STORE_KEY)
    const Filtered = newFiltered(Todos)
    const Counters = newCounters(Todos)
    const Footer = newFooter(Counters, removeCompleted)
    const Filter = fraction(FilterMode.All)
    const NewTodoName = fraction('')

    yield* Autosync
    yield* FILTER(Filter)
    yield* CHANGE_FILTER((mode: FilterMode) => Filter.use(mode))

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
        const newTodoName = yield* NewTodoName

        const list = [] as TodoJsx[]

        for (const Todo of yield* Filtered) {
            list.push((yield* Todo) as TodoJsx)
        }

        yield (
            <Container>
                <Wrapper>
                    <Header>todos</Header>
                    <Main>
                        <NewTodoNameInput
                            type="text"
                            value={newTodoName}
                            onChange={handleNewTodoNameInputChange}
                            onKeyDown={handleNewTodoNameInputKeyDown}
                            placeholder="What needs to be done?"
                        />
                        <List>{list}</List>
                    </Main>
                    {yield* Footer}
                </Wrapper>
            </Container>
        )
    }
})

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
