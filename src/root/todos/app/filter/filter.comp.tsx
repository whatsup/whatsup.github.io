import styles from './filter.scss'
import { WhatsJSX } from '@whatsup-js/jsx'

export function Container({ children }: WhatsJSX.Attributes) {
    return <ul className={styles.filters}>{children}</ul>
}

export type Button = WhatsJSX.Attributes & {
    active: boolean
    onClick: (event: WhatsJSX.MouseEvent<HTMLLIElement>) => void
}

export function Button({ children, active, onClick }: Button) {
    let className = styles.filterBtn

    if (active) {
        className += ` ${styles.active}`
    }

    return (
        <li className={className} onClick={onClick}>
            {children}
        </li>
    )
}
