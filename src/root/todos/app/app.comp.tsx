import styles from './app.scss'

type Props = { children: any }

type InputProps = {
    type: string
    placeholder: string
    value: any
    onInput: (e: any) => void
    onKeyDown: (e: any) => void
}

export function Container({ children }: Props) {
    return <section className={styles.container}>{children}</section>
}

export function Wrapper({ children }: Props) {
    return <section className={styles.wrapper}>{children}</section>
}

export function Header({ children }: Props) {
    return <header className={styles.header}>{children}</header>
}

export function Main({ children }: Props) {
    return <main className={styles.main}>{children}</main>
}

export function FilteredList({ children }: Props) {
    return <ul className={styles.list}>{children}</ul>
}

export function NewTodoNameInput(props: InputProps) {
    return <input className={styles.newTodoNameInput} {...props} />
}
