import styles from './todo.scss'
import { WhatsJSX } from '@whatsup/jsx'
export function Container({ children }: WhatsJSX.Attributes) {
    return <li className={styles.container}>{children}</li>
}
type TodoNameProps = WhatsJSX.Attributes & {
    done: boolean
    onDblClick: (event: WhatsJSX.MouseEvent<HTMLSpanElement>) => void
}
export function TodoName({ children, done, onDblClick }: TodoNameProps) {
    let className = styles.todoName

    if (done) {
        className += ` ${styles.done}`
    }

    return (
        <span className={className} onDblClick={onDblClick}>
            {children}
        </span>
    )
}
type StatusProps = WhatsJSX.Attributes & {
    done: boolean
    onClick: (event: WhatsJSX.MouseEvent<HTMLButtonElement>) => void
}
export function Status({ children, done, onClick }: StatusProps) {
    let className = styles.status

    if (done) {
        className += ` ${styles.done}`
    }

    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    )
}
type RemoveProps = WhatsJSX.Attributes & {
    onClick: (event: WhatsJSX.MouseEvent<HTMLButtonElement>) => void
}
export function Remove({ children, onClick }: RemoveProps) {
    return (
        <button className={styles.remove} onClick={onClick}>
            {children}
        </button>
    )
}
type EditNameProps = WhatsJSX.Attributes & {
    defaultValue: string
    onInput: (event: WhatsJSX.ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (event: WhatsJSX.KeyboardEvent<HTMLInputElement>) => void
}
export function EditNameInput({ defaultValue, onInput, onKeyDown }: EditNameProps) {
    return (
        <input
            type="text"
            className={styles.editName}
            onInput={onInput}
            onKeyDown={onKeyDown}
            defaultValue={defaultValue}
            autoFocus
        />
    )
}
export function CheckboxBlankIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
    )
}
export function CheckboxMarkedIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
        </svg>
    )
}
export function RemoveIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
    )
}
