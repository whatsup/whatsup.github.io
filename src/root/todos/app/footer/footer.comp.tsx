import styles from './footer.scss'

type Props = { children?: any }

export function Container({ children }: Props) {
    return <footer className={styles.container}>{children}</footer>
}

export function Flex({ children }: Props) {
    return <footer className={styles.flex}>{children}</footer>
}

export function Help({ children }: Props) {
    return <div className={styles.help}>{children}</div>
}

export function Left({ children, visible }: Props & { visible: boolean }) {
    let className = styles.left

    if (!visible) {
        className += ` ${styles.invisible}`
    }

    return <span className={className}>{children}</span>
}

export function Clear({ children, visible, onClick }: Props & { visible: boolean; onClick: (e: any) => void }) {
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

export function Filters({ children }: Props) {
    return <ul className={styles.filters}>{children}</ul>
}

export function FilterBtn({ children, active, onClick }: Props & { active: boolean; onClick: (e: any) => void }) {
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
