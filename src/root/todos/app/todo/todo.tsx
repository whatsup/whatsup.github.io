import { Fractal, Conse, Context, Event, conse, cause } from 'whatsup'
import { RemoveEvent } from '../events'
import {
    Container,
    Status,
    CheckboxMarkedIcon,
    CheckboxBlankIcon,
    EditNameInput,
    TodoName,
    Remove,
    RemoveIcon,
} from './todo.comp'
import { createRef } from '@whatsup/jsx'

export type TodoData = { id: string; name: string; done?: boolean }

export class Todo extends Fractal<JSX.Element> {
    readonly id: string
    readonly name: Conse<string>
    readonly done: Conse<boolean>
    readonly edit: Conse<boolean>
    readonly data = cause<TodoData>(makeTodoData, this)

    constructor({ id, name, done = false }: TodoData) {
        super()
        this.id = id
        this.name = conse(name)
        this.done = conse(done)
        this.edit = conse(false)
    }

    *whatsUp(ctx: Context) {
        ctx.on(NeedDisableEditEvent, () => this.edit.set(false))
        ctx.on(NameChangeEvent, (e) => this.name.set(e.value))

        const { id } = this
        const nameEditor = new NameEditor(this.name)

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
                        yield* nameEditor
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
}

function* makeTodoData(this: Todo) {
    while (true) {
        yield {
            id: this.id,
            done: yield* this.done,
            name: yield* this.name,
        } as TodoData
    }
}

class NeedDisableEditEvent extends Event {}
class NameChangeEvent extends Event {
    constructor(readonly value: string) {
        super()
    }
}

class NameEditor extends Fractal<JSX.Element> {
    readonly value: Conse<string>

    constructor(value: Conse<string>) {
        super()
        this.value = value
    }

    *whatsUp(ctx: Context) {
        const ref = createRef()

        const outsideClickHandler = (e: any) => {
            if (!ref.current.contains(e.target)) {
                ctx.dispath(new NeedDisableEditEvent())
            }
        }
        const handleEditInputChange = (e: any) => {
            ctx.dispath(new NameChangeEvent(e.target.value))
        }
        const handleEditInputKeyDown = (e: any) => {
            if (e.key === 'Enter') {
                ctx.dispath(new NeedDisableEditEvent())
            }
        }

        setTimeout(() => {
            // Move cursor to end & focus
            const { current } = ref

            if (current) {
                const value = this.value.get() as string
                current.selectionStart = current.selectionEnd = value.length
                current.focus()
            }
        })

        document.addEventListener('click', outsideClickHandler)

        try {
            while (true) {
                yield (
                    <EditNameInput
                        ref={ref}
                        defaultValue={yield* this.value}
                        onInput={handleEditInputChange}
                        onKeyDown={handleEditInputKeyDown}
                    />
                )
            }
        } finally {
            document.removeEventListener('click', outsideClickHandler)
        }
    }
}
