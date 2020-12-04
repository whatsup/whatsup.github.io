import styles from './footer.scss'
import { FractalJSX } from '@fract/jsx'

export function Container({ children }: FractalJSX.Attributes) {
    return <footer className={styles.container}>{children}</footer>
}

export function Flex({ children }: FractalJSX.Attributes) {
    return <footer className={styles.flex}>{children}</footer>
}

export function Help({ children }: FractalJSX.Attributes) {
    return <div className={styles.help}>{children}</div>
}

export type LeftProps = FractalJSX.Attributes & { visible: boolean }

export function Left({ children, visible }: LeftProps) {
    let className = styles.left

    if (!visible) {
        className += ` ${styles.invisible}`
    }

    return <span className={className}>{children}</span>
}

export type ClearProps = FractalJSX.Attributes & {
    visible: boolean
    onClick: (event: FractalJSX.MouseEvent<HTMLAnchorElement>) => void
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
