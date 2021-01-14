import styles from './app.scss'
import { WhatsJSX } from '@whatsup-js/jsx'

export function Container({ children }: WhatsJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

export function Wrapper({ children }: WhatsJSX.Attributes) {
    return <section className={styles.wrapper}>{children}</section>
}

export function Header({ children }: WhatsJSX.Attributes) {
    return <header className={styles.header}>{children}</header>
}

export function Main({ children }: WhatsJSX.Attributes) {
    return <main className={styles.main}>{children}</main>
}

export function FilteredList({ children }: WhatsJSX.Attributes) {
    return <ul className={styles.list}>{children}</ul>
}

export type NewTodoNameInputProps = WhatsJSX.Attributes & {
    placeholder: string
    value: string
    onInput: (event: WhatsJSX.FormEvent<HTMLInputElement>) => void
    onKeyDown: (event: WhatsJSX.KeyboardEvent<HTMLInputElement>) => void
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
