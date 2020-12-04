import styles from './filter.scss'
import { FractalJSX } from '@fract/jsx'

export function Container({ children }: FractalJSX.Attributes) {
    return <ul className={styles.filters}>{children}</ul>
}

export type Button = FractalJSX.Attributes & {
    active: boolean
    onClick: (event: FractalJSX.MouseEvent<HTMLLIElement>) => void
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
