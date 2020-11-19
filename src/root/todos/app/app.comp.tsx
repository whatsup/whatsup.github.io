import styles from './app.scss'
import { FractalJSX } from '@fract/jsx'

export function Container({ children }: FractalJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

export function Wrapper({ children }: FractalJSX.Attributes) {
    return <section className={styles.wrapper}>{children}</section>
}

export function Header({ children }: FractalJSX.Attributes) {
    return <header className={styles.header}>{children}</header>
}

export function Main({ children }: FractalJSX.Attributes) {
    return <main className={styles.main}>{children}</main>
}

export function FilteredList({ children }: FractalJSX.Attributes) {
    return <ul className={styles.list}>{children}</ul>
}

export type NewTodoNameInputProps = FractalJSX.Attributes & {
    placeholder: string
    value: string
    onInput: (event: FractalJSX.FormEvent<HTMLInputElement>) => void
    onKeyDown: (event: FractalJSX.KeyboardEvent<HTMLInputElement>) => void
}

export function NewTodoNameInput({ value, placeholder, onInput, onKeyDown }: NewTodoNameInputProps) {
    return (
        <input
            type="text"
            className={styles.newTodoNameInput}
            value={value}
            placeholder={placeholder}
            onInput={onInput}
            onKeyDown={onKeyDown}
        />
    )
}
