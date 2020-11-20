import { fraction, Fractal, Fraction, Context, Event } from '@fract/core'
import { MODE, Mode } from 'todos/factors'
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
import { createRef } from '@fract/jsx'

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
        ctx.on(NeedDisableEditEvent, () => this.edit.set(false))
        ctx.on(NameChangeEvent, (e) => this.name.set(e.value))

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
    const nameEdit = new EditName(this.name)

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
                    yield* nameEdit
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

class NeedDisableEditEvent extends Event {}
class NameChangeEvent extends Event {
    constructor(readonly value: string) {
        super()
    }
}

class EditName extends Fractal<JSX.Element> {
    readonly value: Fraction<string>

    constructor(value: Fraction<string>) {
        super()
        this.value = value
    }

    async *collector(ctx: Context) {
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
                current.selectionStart = current.selectionEnd = this.value.get().length
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
