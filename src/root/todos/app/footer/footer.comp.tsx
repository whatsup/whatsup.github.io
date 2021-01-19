import styles from './footer.scss'
import { WhatsJSX } from '@whatsup/jsx'

export function Container({ children }: WhatsJSX.Attributes) {
    return <footer className={styles.container}>{children}</footer>
}

export function Flex({ children }: WhatsJSX.Attributes) {
    return <footer className={styles.flex}>{children}</footer>
}

export function Help({ children }: WhatsJSX.Attributes) {
    return <div className={styles.help}>{children}</div>
}

export type LeftProps = WhatsJSX.Attributes & { visible: boolean }

export function Left({ children, visible }: LeftProps) {
    let className = styles.left

    if (!visible) {
        className += ` ${styles.invisible}`
    }

    return <span className={className}>{children}</span>
}

export type ClearProps = WhatsJSX.Attributes & {
    visible: boolean
    onClick: (event: WhatsJSX.MouseEvent<HTMLAnchorElement>) => void
}

export function Clear({ children, visible, onClick }: ClearProps) {
    let className = styles.clear

    if (!visible) {
        className += ` ${styles.invisible}`
    }

    return (
        <a className={className} onClick={onClick}>
            {children}
        </a>
    )
}
