import styles from './todo.scss'
import { fraction, Fractal, Fraction, Context } from '@fract/core'
import { MODE, Mode } from 'todos/factors'
import { RemoveEvent } from '../events'

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
                        type="text"
                        defaultValue={name}
                        onChange={handleEditInputChange}
                        onKeyDown={handleEditInputKeyDown}
                        autoFocus
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

type Props = { children: any }
type InputProps = {
    ref: any
    type: string
    defaultValue: string
    onChange: (e: any) => void
    onKeyDown: (e: any) => void
    autoFocus: boolean
}

function Container({ children }: Props) {
    return <li className={styles.container}>{children}</li>
}

function TodoName({ children, done, ...other }: Props & { done: boolean; onDoubleClick: () => void }) {
    let className = styles.todoName

    if (done) {
        className += ` ${styles.done}`
    }

    return (
        <span className={className} {...other}>
            {children}
        </span>
    )
}

function Status({ children, done, ...other }: Props & { done: boolean; onClick: () => void }) {
    let className = styles.status

    if (done) {
        className += ` ${styles.done}`
    }

    return (
        <button className={className} {...other}>
            {children}
        </button>
    )
}

function Remove({ children, ...other }: Props & { onClick: () => void }) {
    return (
        <button className={styles.remove} {...other}>
            {children}
        </button>
    )
}

function EditName(props: InputProps) {
    return <input className={styles.editName} {...props} />
}

function CheckboxBlankIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
    )
}

function CheckboxMarkedIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
        </svg>
    )
}

function RemoveIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
    )
}
