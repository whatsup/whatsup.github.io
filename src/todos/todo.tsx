import React from 'react'
import styled from 'styled-components'
import { fractal, fraction, Fractal, factor, Fraction } from '@fract/core'
import { MODE, Mode } from './factors'

type Guts = {
    id: string
    Name: Fraction<string>
    Done: Fraction<boolean>
    Edit: Fraction<boolean>
}

export type Todo = Fractal<TodoService | TodoData | TodoJsx>
export type TodoService = { id: string; Done: Fractal<boolean> }
export type TodoData = { id: string; name: string; done: boolean }
export type TodoJsx = JSX.Element

export enum TodoMode {
    Service,
}

export const TODO_MODE = factor<TodoMode>()
export const REMOVE_TODO = factor<(id: string) => void>()

export function newTodo({ id, name, done }: TodoData): Todo {
    const Name = fraction(name)
    const Done = fraction(done)
    const Edit = fraction(false)
    const guts = { id, Name, Done, Edit } as Guts

    return fractal(async function* _Todo() {
        switch (yield* TODO_MODE) {
            case TodoMode.Service:
                yield* workInServiceMode(guts)
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

async function* workInServiceMode({ id, Done }: Guts) {
    while (true) {
        yield { id, Done } as TodoService
    }
}

async function* workInDataMode({ id, Name, Done }: Guts) {
    while (true) {
        const name = yield* Name
        const done = yield* Done
        yield { id, done, name } as TodoData
    }
}

async function* workInJsxMode({ id, Name, Done, Edit }: Guts) {
    const CheckboxBlankIcon = (await import('./icons/checkbox-blank.svg')).default
    const CheckboxMarkedIcon = (await import('./icons/checkbox-marked.svg')).default
    const RemoveIcon = (await import('./icons/remove.svg')).default

    const remove = yield* REMOVE_TODO
    const editNameRef = (input: HTMLInputElement) => {
        if (input) {
            const outsideClickHandler = (e: any) => {
                if (!input.contains(e.target)) {
                    Edit.use(false)
                    document.removeEventListener('click', outsideClickHandler)
                }
            }
            document.addEventListener('click', outsideClickHandler)
        }
    }
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        Name.use(e.target.value)
    }
    const handleEditInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') Edit.use(false)
    }

    while (true) {
        const name = yield* Name
        const done = yield* Done
        const edit = yield* Edit

        yield (
            <Container key={id}>
                <Status done={done} onClick={() => Done.use(!done)}>
                    {done ? <CheckboxMarkedIcon /> : <CheckboxBlankIcon />}
                </Status>
                {edit ? (
                    <EditName
                        ref={editNameRef}
                        type="text"
                        defaultValue={name}
                        onChange={handleEditInputChange}
                        onKeyDown={handleEditInputKeyDown}
                        autoFocus
                    />
                ) : (
                    <TodoName done={done} onDoubleClick={() => Edit.use(true)}>
                        {name}
                    </TodoName>
                )}
                <Remove onClick={() => remove(id)}>
                    <RemoveIcon />
                </Remove>
            </Container>
        )
    }
}

const Container = styled.li`
    height: 70px;
    display: flex;
    :not(:last-child) {
        border-bottom: 1px solid #f5f5f5;
    }
    :hover {
        ${() => Remove} {
            opacity: 1;
        }
    }
`

const TodoName = styled.span<{ done: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 24px;
    user-select: none;
    color: ${(props) => (props.done ? '#d0d0d0' : 'inherit')};
    transition: color 0.3s ease;
`

const Status = styled.button<{ done: boolean }>`
    border: none;
    background: none;
    outline: none;
    padding: 0;
    width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    fill: ${(props) => (props.done ? '#4fc3f7' : '#e0e0e0')};
    transition: fill 0.3s ease;
`
const Remove = styled.button`
    border: none;
    background: none;
    outline: none;
    padding: 0;
    width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    fill: #e0e0e0;
    opacity: 0;
    transition: opacity 0.3s ease;

    :hover {
        fill: #4fc3f7;
    }
`

const EditName = styled.input`
    flex: 1;
    font-size: 24px;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    font-family: inherit;
    font-weight: inherit;
    color: #000;
`
