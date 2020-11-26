import { Fractal, Observable, Context, Event, observable } from '@fract/core'
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
    readonly name: Observable<string>
    readonly done: Observable<boolean>
    readonly edit: Observable<boolean>

    constructor({ id, name, done = false }: TodoData) {
        super()
        this.id = id
        this.name = observable(name)
        this.done = observable(done)
        this.edit = observable(false)
    }

    stream(ctx: Context) {
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

function* workInDataMode(this: Todo) {
    while (true) {
        yield {
            id: this.id,
            done: yield* this.done,
            name: yield* this.name,
        } as TodoData
    }
}

function* workInJsxMode(this: Todo, ctx: Context) {
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

class NeedDisableEditEvent extends Event {}
class NameChangeEvent extends Event {
    constructor(readonly value: string) {
        super()
    }
}

class NameEditor extends Fractal<JSX.Element> {
    readonly value: Observable<string>

    constructor(value: Observable<string>) {
        super()
        this.value = value
    }

    *stream(ctx: Context) {
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
