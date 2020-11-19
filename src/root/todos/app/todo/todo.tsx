import { fraction, Fractal, Fraction, Context } from '@fract/core'
import { MODE, Mode } from 'todos/factors'
import { RemoveEvent } from '../events'
import {
    Container,
    Status,
    CheckboxMarkedIcon,
    CheckboxBlankIcon,
    EditName,
    TodoName,
    Remove,
    RemoveIcon,
} from './todo.comp'

export type TodoView = Fractal<TodoData | TodoJsx>
export type TodoData = { id: string; name: string; done?: boolean }
export type TodoJsx = JSX.Element

export class Todo extends Fractal<TodoView> {
    readonly id: string
    readonly name: Fraction<string>
    readonly done: Fraction<boolean>
    readonly edit: Fraction<boolean>

    constructor({ id, name, done = false }: TodoData) {
        super()
        this.id = id
        this.name = fraction(name)
        this.done = fraction(done)
        this.edit = fraction(false)
    }

    collector(ctx: Context) {
        switch (ctx.get(MODE)) {
            case Mode.Data:
                return workInDataMode.call(this)
            case Mode.Jsx:
                return workInJsxMode.call(this, ctx)
        }

        throw 'Unknown MODE'
    }
}

async function* workInDataMode(this: Todo) {
    while (true) {
        yield {
            id: this.id,
            done: yield* this.done,
            name: yield* this.name,
        } as TodoData
    }
}

async function* workInJsxMode(this: Todo, ctx: Context) {
    const { id } = this

    const editNameRef = (input: HTMLInputElement) => {
        if (input) {
            const outsideClickHandler = (e: any) => {
                if (!input.contains(e.target)) {
                    this.edit.set(false)
                    document.removeEventListener('click', outsideClickHandler)
                }
            }
            document.addEventListener('click', outsideClickHandler)
        }
    }

    const handleEditInputChange = (e: any) => {
        this.name.set(e.target.value)
    }
    const handleEditInputKeyDown = (e: any) => {
        if (e.key === 'Enter') this.edit.set(false)
    }

    while (true) {
        const name = yield* this.name
        const done = yield* this.done
        const edit = yield* this.edit

        yield (
            <Container key={id}>
                <Status done={done} onClick={() => this.done.set(!done)}>
                    {done ? <CheckboxMarkedIcon /> : <CheckboxBlankIcon />}
                </Status>
                {edit ? (
                    <EditName
                        ref={editNameRef}
                        defaultValue={name}
                        onChange={handleEditInputChange}
                        onKeyDown={handleEditInputKeyDown}
                    />
                ) : (
                    <TodoName done={done} onDblClick={() => this.edit.set(true)}>
                        {name}
                    </TodoName>
                )}
                <Remove onClick={() => ctx.dispath(new RemoveEvent(this))}>
                    <RemoveIcon />
                </Remove>
            </Container>
        )
    }
}
